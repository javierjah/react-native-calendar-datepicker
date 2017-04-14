/**
* DaySelector pure component.
*/

import React, { Component } from 'react';
import {
  Dimensions,
  PanResponder,
  TouchableHighlight,
  LayoutAnimation,
  View,
  Text,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';

export default class DaySelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      days: this._computeDays(props),
      currentMonth: '',
    }
  }

  _slide = (dx) => {
    this.refs.wrapper.setNativeProps({
      style: {
        left: dx,
      }
    })
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.focus != nextProps.focus || this.props.selected != nextProps.selected) {
      this.setState({
        days: this._computeDays(nextProps),
      })
    }

    if (this.props.monthOffset != nextProps.monthOffset && nextProps.monthOffset !== 0) {
      const newFocus = Moment(this.props.focus).add(nextProps.monthOffset, 'month');
      this.props.onFocus && this.props.onFocus(newFocus);
    }
  }

  _computeDays = (props) => {
    let result = [];
    const currentMonth = props.focus.month();
    let iterator = Moment(props.focus);
    while (iterator.month() === currentMonth) {
      if (iterator.weekday() === 0 || result.length === 0) {
        result.push(_.times(7, _.constant({})));
      }
      let week = result[result.length - 1];
      week[iterator.weekday()] = {
        valid: this.props.maxDate.diff(iterator, 'seconds') >= 0 &&
               this.props.minDate.diff(iterator, 'seconds') <= 0,
        date: iterator.date(),
        selected: props.selected && iterator.isSame(props.selected, 'day'),
        today: iterator.isSame(Moment(), 'day'),

      };
      iterator.add(1, 'day');
    }
    return result;
  };

  _onDayChange = (day) => {
    let date = Moment(this.props.focus).add(day.date - 1 , 'day');
    this.props.onDayChange(date);
  }

  render() {
    return (
      <View>
        <View style={[styles.headerView, this.props.dayHeaderView]}>
          {_.map(Moment.weekdaysShort(true), (day) =>
            <Text key={day} style={[styles.headerText, this.props.dayHeaderText]}>
              {day}
            </Text>
          )}
        </View>
        <View ref="wrapper" >
          {_.map(this.state.days, (week, i) =>
            <View key={i} style={[
                styles.rowView,
                this.props.dayRowView,
                i === this.state.days.length - 1 ? {
                  borderBottomWidth: 0,
                } : null,
              ]}>
              {_.map(week, (day, j) =>
                <TouchableHighlight
                  key={j}
                  style={[
                    styles.dayView,
                    this.props.dayView,
                    day.selected ? this.props.daySelectedView : null
                  ]}
                  activeOpacity={day.valid ? 0.8 : 1}
                  underlayColor='transparent'
                  onPress={() => day.valid && this._onDayChange(day)}>
                  <View>
                    <Text style={[
                      styles.dayText,
                      this.props.dayText,
                      day.today ? this.props.dayTodayText : null,
                      day.selected ? styles.selectedText : null,
                      day.selected ? this.props.daySelectedText : null,
                      day.valid ? null : styles.disabledText,
                      day.valid ? null : this.props.dayDisabledText,
                    ]}>
                      {day.date}
                    </Text>
                    {this.props.dayPainted.indexOf(day.date) >= 0 ? <View style={styles.eventDayPointer}/> : null}
                  </View>
                </TouchableHighlight>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
DaySelector.defaultProps = {
  focus: Moment().startOf('month'),
  minDate: Moment(),
  maxDate: Moment(),
};

DaySelector.propTypes = {
  dayPainted: React.PropTypes.array,
  // Focus and selection control.
  focus: React.PropTypes.any,
  selected: React.PropTypes.any,
  onDayChange: React.PropTypes.any,
  onFocus: React.PropTypes.any,
  monthOffset: React.PropTypes.any,
  // Minimum and maximum dates.
  minDate: React.PropTypes.any,
  maxDate: React.PropTypes.any,
  // Styling properties.
  dayHeaderView: React.PropTypes.any,
  dayHeaderText: React.PropTypes.any,
  dayRowView: React.PropTypes.any,
  dayView: React.PropTypes.any,
  daySelectedView: React.PropTypes.any,
  dayText: React.PropTypes.any,
  dayTodayText: React.PropTypes.any,
  daySelectedText: React.PropTypes.any,
  dayDisabledText: React.PropTypes.any,
}

const styles = StyleSheet.create({
  headerView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    height: 35,
  },
  headerText: {
    flexGrow: 1,
    minWidth: 40,
    textAlign: 'center',
  },
  rowView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    height: 35,
  },
  dayView: {
    flexGrow: 1,
    margin: 5,
  },
  dayText: {
    flexGrow: 1,
    minWidth: 30,
    padding: 9,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectedText: {
    borderRadius: 5,
    borderWidth: 1,
    fontWeight: 'bold',
  },
  disabledText: {
    borderColor: 'grey',
    color: 'grey',
  },
  eventDayPointer: {
    backgroundColor:'#1abc9c',
    width:5,
    height:5,
    borderRadius:10,
    alignSelf:'center',
    alignItems: 'flex-end',
    marginTop:-6,
    paddingBottom:6,
  }
});
