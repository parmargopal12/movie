import React, {Component} from 'react';
import '../styles/App.css';
import {Button, Glyphicon, Pagination, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import toastr from 'toastr';
import Select from 'react-select';
import Confirm from './common/Confirm';
import EditMovie from './EditMovie';
import autoBind from 'react-autobind';
import axios from 'axios';
import noMovie from '../../public/no-movie.png';
import loadingImage from '../../public/loading.gif';
import ReactImageFallback from "react-image-fallback";
let backendHost = 'http://192.168.0.6:9000';
let moviePaginationRecordLimit = 10;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            total: 0,
            movieToDeleteId: null,
            movieToEdit: null,
            activePage: 1,
            searchByYear: null,
            searchStr: ''
        };
        autoBind(this);
    }

    get anyMovies() {
        let movies = this.state.movies;
        return movies && movies.length;
    }

    componentDidMount() 
    {
        this.loadData();
    }

    loadData() 
    {
        var _this=this;
        var activePage = _this.state.activePage;
        var searchByYear = (_this.state.searchByYear!=null)?_this.state.searchByYear.value:'';
        var searchStr = _this.state.searchStr;

        axios
        .get(backendHost+'/getmovies?activePage='+activePage+'&searchByYear='+searchByYear+'&searchStr='+searchStr+'&limit='+moviePaginationRecordLimit) 
        .then(response => {
            if (response.data.success === true) 
            {
                _this.setState({
                    movies: response.data.movies,
                    total: response.data.total
                })
            }
        })
    }

    confirmDeleteMovie(id) {
        this.setState({
            movieToDeleteId: id
        });
    }

    deleteMovie() 
    {
        var delete_id = this.state.movieToDeleteId;
        if(typeof delete_id != 'undefined' && delete_id != '')
        {
            this.setState({movieToDeleteId: null}, () => {
                axios
                .post(backendHost+'/delete', {
                    delete_id                   
                })
                .then(response => {
                    if (response.data.success === true) 
                    {
                        this.loadData();
                        toastr.success(response.data.message);
                    }
                })
            });
        }
    }

    cancelDeleteMovie() {
        this.setState({
            movieToDeleteId: null
        });
    }

    pageSelection(eventKey) {
        this.setState({
            activePage: eventKey
        }, () => {
            this.loadData();
        });
    }

    searchBy(selectedOption) {
        this.setState({
            searchByYear: selectedOption,
            activePage: 1
        });
    }

    search() {
        this.setState({
            activePage: 1
        }, () => {
            this.loadData();
        });
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

    updateMovie(movie) {
        this.setState({
            movieToEdit: Object.assign({}, movie)
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
            .post(backendHost+'/create_update_movie', {
                id,
                title,
                year,
                description,
                posterurl
            })
            .then(response => {
                if (response.data.success === true) 
                {
                    this.loadData();
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
            <h2>Movie List</h2>
            {this.renderFilterBar()}
            <div className="movie-box">
            {this.renderMoviesList()}
            {this.renderPagination()}
            </div>
            </div>
            </div>
            </div>
            );
    }
    renderPagination(){
        let pageNumber = Math.ceil(this.state.total / moviePaginationRecordLimit);
        
        return (
            <div className="row">
            <div className="col-md-10 text-right" >
            {this.anyMovies ?
                <Pagination
                bsSize="medium"
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                items={pageNumber}
                activePage={this.state.activePage}
                onSelect={this.pageSelection}
                /> : null
            }
            </div>
            </div>
            );
    }
    renderMoviesList() {
        let deleteConfirmVisible = this.state.movieToDeleteId ? true : false;
        let editMovieVisible = this.state.movieToEdit ? true : false;
        return (
            <div>
            <div id="movie-list">
            {
                (!this.anyMovies)
                ?(<div style={{marginTop: 30}}>No movies.</div>)
                :this.state.movies.map(movie => this.renderMovie(movie)
                    )
            }
            </div>
            <div>
            <EditMovie visible={editMovieVisible} movie={this.state.movieToEdit} save={this.saveMovie} close={this.cancelEditMovie} onChange={this.updateMovieState}/>
            <Confirm visible={deleteConfirmVisible} action={this.deleteMovie} close={this.cancelDeleteMovie}/>
            </div>

            </div>
            );
    }

    renderFilterBar() {
        let searchByYearOptions = [];
        for (let i = 1900; i <= 2050; i++) 
        {             
            searchByYearOptions.push({
                value: i, 
                label: i
            });
        }
        var selectedOption= this.state.searchByYear;
        var value = selectedOption && selectedOption.value;
        return (
            <div  id="filter-bar">
            <div className="row">
            <div className="col-sm-2" >
            <Select
            name="search-by-dropdown"
            id="search-by-dropdown"
            value={value}
            placeholder="Select year"
            onChange={this.searchBy}
            options={searchByYearOptions}
            />
            </div>
            <div className="col-sm-2 text-left" >
            <input type="text"
            className="form-control"
            value={this.state.searchStr}
            onChange={(event) => {
                this.setState({
                    searchStr: event.target.value
                });
            }}
            onKeyPress={(target) => {
                if (target.charCode === 13) {
                    this.search();
                }
            }}
            />
            </div>
            <div className="col-sm-1 text-left" >
            <Button bsStyle="primary" onClick={() => this.search()}>Search</Button>
            </div>

            <div className="col-sm-5">
            </div>
            <div className="col-sm-1 pull-right" >
            <Button bsStyle="success" onClick={this.addMovie}>
            <Glyphicon glyph="plus"/>
            </Button>
            </div>
            </div>
            </div>
            );
    }

    renderMovie(movie) {
        let posterurl = (movie.posterurl) ? movie.posterurl : noMovie;
        return (
            <div className="movie-row" key={movie._id}>

            <div className="image">
            <ReactImageFallback
            src={posterurl}
            width={100}
            fallbackImage={noMovie}
            initialImage={loadingImage}
            alt={movie.title}
            className="my-image" />
            </div>

            <div className="title">
            <h4>
            <a onClick={() => this.updateMovie(movie)} style={{cursor: 'pointer'}}>{movie.title}</a>
            <Button bsStyle="danger btn-xs" 
            onClick={() =>
                this.confirmDeleteMovie(movie._id)
            }>
            <Glyphicon   glyph="remove"/>
            </Button>
            <Button  bsStyle="warning btn-xs"  onClick={() => this.updateMovie(movie)}>
            <Glyphicon glyph="edit"/>
            </Button>
            </h4>

            <p className="movie-info">
            {movie.year}
            </p>

            <p className="plot">{movie.description}</p>
            </div>
            </div>
            );
    }
}
export default App;