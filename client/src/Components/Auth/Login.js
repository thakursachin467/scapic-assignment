import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginuser } from '../../actions/authActions';
import TextField from '../Common/Inputs/Input';
import {Link} from 'react-router-dom';
class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
            formFields:[
                {
                    placeholder:'Email',
                    name:'email',
                    type:'email'
                },
                {
                    placeholder:'Password',
                    name:'password',
                    type:'password'
                },
            ],
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })

    }
    componentDidMount() {
        if (this.props.isAuth.isAuthanticated) {
            this.props.history.push('/dashboard');
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isAuth.isAuthanticated) {
            this.props.history.push('/dashboard');
        }

        if (nextProps.errors) {

            this.setState({ errors: nextProps.errors })
        }
    }
    onSubmit(e) {
        e.preventDefault();
        const authUser = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginuser(authUser);

    }

    render() {
        const { errors } = this.state;

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <form onSubmit={this.onSubmit} className="shadow p-3 mb-5 bg-white rounded">
                                {
                                    this.state.formFields.map(field=>{
                                      return   <TextField
                                            placeholder={field.placeholder}
                                            type={field.type}
                                            name={field.name}
                                            value={this.state[field.name]}
                                            onChange={this.onChange}
                                            error={errors[field.name]} />
                                    })
                                }
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                                <p className=" mt-3" style={{"textAlign":"center"}}>
                                    <a href='http://localhost:5000/api/auth/google' className="btn btn-block  btn-info">Login Using google</a>
                                    <a href='http://localhost:5000/api/auth/facebook' className="btn btn-block btn-info" >Login Using facebook</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

Login.propTypes = {
    loginuser: propTypes.func.isRequired,
    errors: propTypes.object.isRequired,
    isAuth: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    isAuth: state.auth,
    errors: state.errors

})

export default connect(mapStateToProps, { loginuser })(Login);