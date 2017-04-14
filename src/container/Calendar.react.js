/**
* Calendar container component.
*/

console.ignoredYellowBox = ['Warning: Overriding '];

import React, { Component } from 'react';
import {
  LayoutAnimation,
  Slider,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome'

//icons
const leftArrow = (<Icon name="angle-left" size={30} color="white"/>)
const rightArrow = (<Icon name="angle-right" size={30} color="white"/>)

// Pure components importing.
import YearSelector from '../pure/YearSelector.react';
import MonthSelector from '../pure/MonthSelector.react';
import DaySelector from '../pure/DaySelector';

// type Stage = "day" | "month" | "year";
const DAY_SELECTOR = "day";
const MONTH_SELECTOR = "month";
const YEAR_SELECTOR = "year";

export default class Calendar extends Component {
  static defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      stage: props.startStage,
      focus: Moment(props.selected).startOf('month'),
      monthOffset: 0,
      date: Moment(),
      groupEventsByMonths: [],
      currentMonthEvents: [],
      currentMonth: Moment(),
    }
    console.log('sosososi', this)
  }

  _changeFocus = (focus) => {
    this.setState({focus, monthOffset: 0})
    this._nextStage()
  }

  _stageText = () => {
    if (this.state.stage === DAY_SELECTOR) {
      return this.state.focus.format('MMMM YYYY')
    } else {
      return this.state.focus.format('YYYY')
    }
  }

  _previousStage = () => {
    if (this.state.stage === DAY_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: YEAR_SELECTOR})
    }
  }

  _nextStage = () => {
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: DAY_SELECTOR})
    }
    if (this.state.stage === YEAR_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
  }

  _previousMonth = () => {
    let date = this.state.currentMonth.subtract(1, 'month')

    this.props.onMonthChange(date)
    this.setState({monthOffset: -1})
  }

  _nextMonth = () => {
    let date = this.state.currentMonth.add(1, 'month')

    this.props.onMonthChange(date)
    this.setState({monthOffset: 1})
  }

  _onDayChange(date) {
    this.props.onDayChange(date)
    this.setState({date: date})
  }

  render() {
    const barStyle = StyleSheet.flatten([styles.barView, this.props.barView]);

    const previousMonth = Moment(this.state.focus).subtract(1, 'month');
    const previousMonthValid = this.props.minDate.diff(Moment(previousMonth).endOf('month'), 'seconds') <= 0;
    const nextMonth = Moment(this.state.focus).add(1, 'month');
    const nextMonthValid = this.props.maxDate.diff(Moment(nextMonth).startOf('month'), 'seconds') >= 0;
    const dayDelectorComponent = (
      <DaySelector
        ref='dayselector'
        focus={this.state.focus}
        selected={this.state.date}
        onFocus={this._changeFocus}
        onDayChange={(date) => this._onDayChange(date)}
        monthOffset={this.state.monthOffset}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        // Transfer the corresponding styling properties.
        dayHeaderView={this.props.dayHeaderView}
        dayHeaderText={this.props.dayHeaderText}
        dayRowView={this.props.dayRowView}
        dayView={this.props.dayView}
        daySelectedView={this.props.daySelectedView}
        dayText={this.props.dayText}
        dayTodayText={this.props.dayTodayText}
        daySelectedText={this.props.daySelectedText}
        dayDisabledText={this.props.dayDisabledText}
        dayPainted={this.props.dayPainted}
        />
    )

    const monthSelectorComponent = (
      <MonthSelector
        focus={this.state.focus}
        onFocus={this._changeFocus}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        // Styling properties
        monthText={this.props.monthText}
        monthDisabledText={this.props.monthDisabledText}
        />
    )

    const yearSelectorComponent = (
      <YearSelector
        focus={this.state.focus}
        onFocus={this._changeFocus}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        // Styling properties
        minimumTrackTintColor={this.props.yearMinTintColor}
        maximumTrackTintColor={this.props.yearMaxTintColor}
        yearSlider={this.props.yearSlider}
        yearText={this.props.yearText}
        />
    )

    const calendar = () => {
      if (this.state.stage === DAY_SELECTOR) {
        return dayDelectorComponent
      } else if (this.state.stage === MONTH_SELECTOR) {
        return monthSelectorComponent
      } else if (this.state.stage === YEAR_SELECTOR) {
        return yearSelectorComponent
      }

      return null
    }
    return (
      <View style={[{minWidth: 300}, this.props.style]}>
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.barView, this.props.barView]}>
            { this.props.showArrows && this.state.stage === DAY_SELECTOR && previousMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._previousMonth}
              >
                <Text style={[this.props.barText, {marginRight:20}]}>{leftArrow}</Text>
              </TouchableHighlight> : <View/>
            }

            <TouchableHighlight
              activeOpacity={this.state.stage !== YEAR_SELECTOR ? 0.8 : 1}
              underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
              onPress={this._previousStage}
              style={{ alignSelf: 'center' }}
            >
              <Text style={this.props.barText}>
                {this._stageText()}
              </Text>
            </TouchableHighlight>

            { this.props.showArrows && this.state.stage === DAY_SELECTOR && nextMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._nextMonth}
              >
                <Text style={[this.props.barText, {marginLeft:20}]}>{rightArrow}</Text>
              </TouchableHighlight> : <View/>
            }
          </View>
        </View>
        <View
          style={[styles.stageWrapper, this.props.stageView]}>
          {calendar()}
        </View>
      </View>
    )
  }
}
Calendar.defaultProps = {
  minDate: Moment(),
  maxDate: Moment().add(2, 'years'),
  startStage: DAY_SELECTOR,
  showArrows: false,
}

Calendar.propTypes = {
  // The core properties.
  selected: React.PropTypes.any,
  onDayChange: React.PropTypes.any,
  onMonthChange: React.PropTypes.any,
  dayPainted: React.PropTypes.array,
  // Minimum and maximum date.
  minDate: React.PropTypes.any,
  maxDate: React.PropTypes.any,
  // The starting stage for selection. Defaults to day.
  startStage: React.PropTypes.oneOf(['day', 'month', 'year']),
  // General styling properties.
  style: React.PropTypes.any,
  barView: React.PropTypes.any,
  barText: React.PropTypes.any,
  stageView: React.PropTypes.any,
  showArrows: React.PropTypes.bool,
  // Styling properties for selecting the day.
  dayHeaderView: React.PropTypes.any,
  dayHeaderText: React.PropTypes.any,
  dayRowView: React.PropTypes.any,
  dayView: React.PropTypes.any,
  daySelectedView: React.PropTypes.any,
  dayText: React.PropTypes.any,
  dayTodayText: React.PropTypes.any,
  daySelectedText: React.PropTypes.any,
  dayDisabledText: React.PropTypes.any,
  // Styling properties for selecting the month.
  monthText: React.PropTypes.any,
  monthDisabledText: React.PropTypes.any,
  // Styling properties for selecting the year.
  yearMinTintColor: React.PropTypes.string,
  yearMaxTintColor: React.PropTypes.string,
  yearSlider: React.PropTypes.any,
  yearText: React.PropTypes.any,
};


const styles = StyleSheet.create({
  barView: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStage: {
    padding: 5,
    alignItems: 'center',
  },
  stageWrapper: {
    padding: 5,
    overflow: 'hidden',
  },
});
