import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import TextInput from './common/TextInput';
import TextAreaInput from './common/TextAreaInput';
import NumberInput from './common/NumberInput';
import autoBind from 'react-autobind';

class EditMovie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
        autoBind(this);
    }

    componentWillReceiveProps() {
        this.setState({
            errors: {}
        });
    }

    formIsValid() {
        let errors = {};
        let fieldIsRequired = 'Field is required.';
        let movie = this.props.movie;

        if (!movie.title) {
            errors.title = fieldIsRequired;
        }

        if (!movie.year) {
            errors.year = fieldIsRequired;
        } else if (movie.year < 1900 || movie.year > 2050) {
            errors.year = 'Invalid year value (should be between 1900 and 2050).'
        }

        if (!movie.description) {
            errors.description = fieldIsRequired;
        }
        this.setState({errors: errors});
        return Object.keys(errors).length === 0;
    }

    save() {
        if (!this.formIsValid()) return;
        this.props.save();
    }

    render() {
        if (!this.props.movie) return null;

        return (
            <div>
            <Modal show={this.props.visible} onHide={this.props.close}>
            <Modal.Header closeButton onClick={this.props.close}>
            <Modal.Title>Add/Edit movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
            <TextInput
            name="title"
            label="Title"
            value={this.props.movie.title}
            onChange={this.props.onChange}
            placeholder="Title"
            error={this.state.errors.title}
            />

            <NumberInput
            name="year"
            label="Year"
            value={this.props.movie.year}
            onChange={this.props.onChange}
            error={this.state.errors.year}
            />

            <TextAreaInput
            name="description"
            rows={4}
            isLargeText={true}
            label="Description"
            value={this.props.movie.description}
            onChange={this.props.onChange}
            placeholder="Description"
            error={this.state.errors.description}
            />

            <TextInput
            name="posterurl"
            label="Poster URL"
            value={this.props.movie.posterurl}
            onChange={this.props.onChange}
            placeholder="Poster URL"
            error={this.state.errors.posterurl}
            />
            
            </Modal.Body>
            <Modal.Footer>
            <Button bsStyle="primary" onClick={this.save}>Save</Button>
            <Button onClick={this.props.close}>Cancel</Button>
            </Modal.Footer>
            </Modal>
            </div>
            );
    }
}

EditMovie.propTypes = {
    save: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired,
    movie: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    visible: React.PropTypes.bool
};

export default EditMovie;