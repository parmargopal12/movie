import React, {Component} from 'react';
import '../styles/App.css';
import {Button, Glyphicon, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import toastr from 'toastr';
import EditMovie from './EditMovie';
import autoBind from 'react-autobind';
import axios from 'axios';
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

    saveMovie() {
        let id = (typeof this.state.movieToEdit._id != 'undefined' && this.state.movieToEdit._id != '') ? this.state.movieToEdit._id : '';
        let title = this.state.movieToEdit.title;
        let year = this.state.movieToEdit.year;
        let description = this.state.movieToEdit.description;
        let posterurl = this.state.movieToEdit.posterurl;

        this.setState({movieToEdit: null}, () => {
            axios
            .post('http://localhost:9000/create_update_movie', {
                id,
                title,
                year,
                description,
                posterurl
            })
            .then(response => {
                if (response.data.success === true) 
                {
                    toastr.success(response.data.message);
                }
            })
        });
    }

    cancelEditMovie() {
        this.setState({
            movieToEdit: null
        });
    }

    updateMovieState(field, value) {
        let movie = this.state.movieToEdit;

        movie[field] = value;

        return this.setState({movieToEdit: movie});
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
            <EditMovie visible={editMovieVisible} movie={this.state.movieToEdit} save={this.saveMovie} close={this.cancelEditMovie} onChange={this.updateMovieState} />
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