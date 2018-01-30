import React, {Component} from 'react';
import '../styles/App.css';
import {Button, Glyphicon, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import EditMovie from './EditMovie';
import autoBind from 'react-autobind';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieToEdit: null            
        };
        autoBind(this);
    }

    addMovie() {
        this.setState({
            movieToEdit: {
                title: '',
                year: 2018,
                description: '',
                posterurl:''
            }
        });
    }

    cancelEditMovie() {
        this.setState({
            movieToEdit: null
        });
    }
    
    render() {
        return (
            <div className="App">
            <div className="container">
            <div className="row">
            {this.renderFilterBar()}
            {this.renderMoviesList()}
            </div>
            </div>
            </div>
            );
    }

    renderMoviesList() {
        let editMovieVisible = this.state.movieToEdit ? true : false;
        return (
            <div>
            <div>
            <EditMovie visible={editMovieVisible} movie={this.state.movieToEdit} close={this.cancelEditMovie} />
            </div>

            </div>
            );
    }

    
    renderFilterBar() {
        let sortByOptions = [
        {key: 'title', text: 'Title'},
        {key: 'year', text: 'Year'}            
        ];

        let itemStyle = {marginTop: 19};
        let searchInputStyle = {height: 27, marginRight: 10};

        return (
            <div id="filter-bar" className="row">
            <div className="col-sm-1" style={itemStyle}>
            <ButtonToolbar>
            <DropdownButton bsSize="small" title="Sort By:" id="sort-by-dropdown">
            {sortByOptions.map(item => {
                return (
                    <MenuItem key={item.key} active={this.state.sortBy === item.key}>{item.text}</MenuItem>
                    )
            })}
            </DropdownButton>
            </ButtonToolbar>
            </div>
            <div className="col-sm-4 text-left" style={itemStyle}>
            <input type="text"
            style={searchInputStyle} />
            <Button bsStyle="primary">Search</Button>
            </div>
            <div className="col-sm-1" style={itemStyle}>
            <Button bsStyle="success" onClick={this.addMovie}>
            <Glyphicon glyph="plus"/>
            </Button>
            </div>
            </div>
            );
    }


}
export default App;