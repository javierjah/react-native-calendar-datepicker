# React Native Calendar Datepicker

## Description
<!--
This project aims at providing developers with a *cross-platform, highly customizable*, **calendar date picker** component for React Native.-->
## Installation

`npm install --save react-native-calendar-datepicker`

__Minimum react-native: "^0.33.0"__

## Basic Usage
<!--
Getting started with this component is very very easy. However, the initial appearance is minimalistic, but the library offers the developer the ability to easily customize it.

In its most basic form, the usage of this component looks like this:

```javascript
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';

...

  <Calendar
    onChange={(date) => this.setState({date})}
    selected={this.state.date}
    // We use Moment.js to give the minimum and maximum dates.
    minDate={Moment().startOf('day')}
    maxDate={Moment().add(10, 'years').startOf('day')}
    />
```-->

## API Reference

**Note**: Each date provided will be a Moment.js object.

### Basic properties

| Property | Type | Explanation
| --- | --- | ---
| *selected* | Moment | The currently selected date
| *onChange* | (date: Moment) => void | Callback for selecting a date
| *minDate* | Moment | **[Mandatory]** Minimum selectable date
| *maxDate* | Moment | **[Mandatory]** Maximum selectable date
| *startStage* | "day"/"month"/"year" | **[Default: "day"]** Whether you would like to select the day, month or year first.
| *slideThreshold* | number | **[Default: min([width / 3, 250])]** The number of pixels after which the slide event will be triggered.
| *showArrows* | boolean | **[Default: false]** Whether you would like to show arrow buttons for moving between months.

### Locale specific calendar

In order to change the locale of the calendar, just change the locale of Moment.js. Please make sure to do so before using the calendar component.

| Property | Type | Explanation
| --- | --- | ---
| style | View.propTypes.style | View wrapper of the calendar
| barView | View.propTypes.style | Styling the view wrapper for the bar at the top of the component
| barText | Text.propTypes.style | Styling the text in the top bar
| stageView | View.propTypes.style | Styling the view wrapper of the current stage
| dayHeaderView | View.propTypes.style | Styling the view wrapper of day names
| dayHeaderText | Text.propTypes.style | Styling the text of day names
| dayRowView | View.propTypes.style | Styling each  row view of days
| dayView | View.propTypes.style | View wrapper of each day
| dayText | Text.propTypes.style | Styling the text of each day number
| dayTodayText | Text.propTypes.style | Highlighting today in the calendar
| daySelectedText | Text.propTypes.style | Highlighting the selected day in the calendar
| dayDisabledText | Text.propTypes.style | Styling unavailable dates in the calendar
| monthText | Text.propTypes.style | Styling the text for each month in the month selector
| monthDisabledText | Text.propTypes.style | Styling unavailable months
| yearMinTintColor | string | Styling left side of year slider
| yearMaxTintColor | string | Styling right side of year slider
| yearSlider | Slider.propTypes.style | Styling the year slider
| yearText | Text.propTypes.style | Styling the year text


## Credits

Component github based: [Vlad-Doru Ion](http://github.com/vlad-doru)

## License

MIT
