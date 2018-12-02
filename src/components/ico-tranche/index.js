import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
import ICOTrancheList from './list';

// actions
import {
    setICODetails,
} from '../../reducers/icos/actions';
import {
    setCoinTransactionSettingList,
} from '../../reducers/coin-transaction-settings/actions';
import {
    setICOTrancheList,
    setICOTrancheDetails,
} from '../../reducers/ico-tranches/actions';

// resources
import {
    getICO
} from '../../reducers/icos/resources';
import {
    getICOTranche,
    getICOTranches
} from '../../reducers/ico-tranches/resources';

const defaultICOTrancheListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: ['transactionSettings'],  
	orderBy: {
        ico_id: 'Asc',
        created_at: 'Asc',
    },
	pageSize: 5,
};

class ICOTranches extends Component {
    componentWillMount() {
        this.getICO(this.props.match.params.icoId);
    }

    /**
     * Get coin transaction setting
     * @param {Integer} ICOId
     * @return {void} set ICO details
     */
    getICO = ICOId => {
		this.props.setICODetails({
			load: true,
			details: {}
		});

		return getICO(ICOId)
				.then( res => {
					this.props.setICODetails({
						load: false,
						details: res
                    });
                    
                    // get ICO tranches
                    this.getICOTranches({...defaultICOTrancheListOptions, ...{
                        filters: {...defaultICOTrancheListOptions.filters,
                            ...{'ico_id': `=|${ICOId}`}
                        }
                    }});
				})
				.catch( err => {
					this.props.setICODetails({load: false});
				});;
	}
    
    /**
     * Get ICO tranche
     * @param {Integer} ICOTrancheId
     * @return {void} set ICO Tranche details
     */
    getICOTranche = ICOTrancheId => {
		this.props.setICOTrancheDetails({
			load: true,
			details: {}
		});

		return getICOTranche(ICOTrancheId)
				.then(res => {
					this.props.setICOTrancheDetails({
						load: false,
						details: res
					});
				})
				.catch(err => {
					this.props.setICOTrancheDetails({load: false});
				});;
	}

    /**
     * Get ICO tranches
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {void} set ICO tranche list
     */
    getICOTranches = (options = {}, cancellable = false) => {
        this.props.setICOTrancheList({
			list: [],
			load: cancellable ? false : true,
		});

		return getICOTranches(options, cancellable)
			.then( res => {
				let list = res.data.map(item => {
					return {...item, key: item.id};
				});

				this.props.setICOTrancheList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch( err => {
				this.props.setICOTrancheList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
    }

    render () {
        return (
            <div>
                <ICOTrancheList
                    getICOTranche={this.getICOTranche}
                    getICOTranches={this.getICOTranches}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        // ico tranches
        ICOTranche: state.icoTranches.ICOTranche,
        ICOTranches: state.icoTranches.ICOTranches,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        // coin transaction settings
        setCoinTransactionSettingList(list) {
            dispatch(setCoinTransactionSettingList(list));
        },

        // ico
        setICODetails(details) {
            dispatch(setICODetails(details));
        },

        // ico tranches
        setICOTrancheList(list) {
            dispatch(setICOTrancheList(list));
        },
        setICOTrancheDetails(details) {
            dispatch(setICOTrancheDetails(details));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ICOTranches);