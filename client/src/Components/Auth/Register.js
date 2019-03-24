import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextField from '../Common/Input';



class Register extends Component {
    constructor() {
        super();
        this.state = {
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            rePassword: '',
            errors: {

            }
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        if (this.props.auth.isAuthanticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors })
        }
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })

    }
    onSubmit(e) {
        e.preventDefault();
        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            rePassword: this.state.rePassword
        };
        this.props.registerUser(newUser, this.props.history);
    }
    render() {
        const { errors } = this.state;

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">

                            <form onSubmit={this.onSubmit} className="shadow p-3 mb-5 bg-white rounded">
                                <TextField
                                    placeholder="First Name"
                                    name="firstName"
                                    value={this.state.firstName}
                                    onChange={this.onChange}
                                    type="text"
                                    error={errors.name} />
                                <TextField
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={this.onChange}
                                    type="text"
                                    error={errors.name} />

                                <TextField
                                    placeholder="Email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    type="email"
                                    error={errors.email}  />
                                <TextField
                                    placeholder="Phone"
                                    name="phone"
                                    value={this.state.phone}
                                    onChange={this.onChange}
                                    type="text"
                                    error={errors.phone} />

                                <TextField
                                    placeholder="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    type="password"
                                    error={errors.password} />


                                <TextField
                                    placeholder="Confirm password"
                                    name="rePassword"
                                    value={this.state.rePassword}
                                    onChange={this.onChange}
                                    type="password"
                                    error={errors.rePassword} />
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                                <p className=" mt-3" style={{"textAlign":"center"}}>
                                    <a className="btn btn-block  btn-info">Signup Using google</a>
                                    <a className="btn btn-block btn-info" >Signup Using facebook</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

Register.propTypes = {
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { registerUser })(withRouter(Register));