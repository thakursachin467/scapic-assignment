import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import { connect } from 'react-redux';
import { registerUser ,googleOauth, facebookOauth} from '../../actions/authActions';
import TextField from '../Common/Inputs/Input';
import {Link} from 'react-router-dom';


class Register extends Component {
    constructor() {
        super();
        this.state = {
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            rePassword: '',
            errors: {},
            formFields:[
                {
                    placeholder:'First Name',
                    name:'firstName',
                    type:'text'
                },
                {
                    placeholder:'Last Name',
                    name:'lastName',
                    type:'text'
                },
                {
                    placeholder:'Email',
                    name:'email',
                    type:'email'
                },
                {
                    placeholder:'Phone',
                    name:'phone',
                    type:'tel'
                },
                {
                    placeholder:'Password',
                    name:'password',
                    type:'password'
                },
                {
                    placeholder:'Re-enter Password',
                    name:'rePassword',
                    type:'password'
                },
            ],
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        console.log(this.props.auth);
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
     signupGoogle= ()=>{
        this.props.googleOauth();
    };
    signupFacebook= ()=>{
        this.props.facebookOauth();
    };
    onSubmit(e) {
        e.preventDefault();
        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            rePassword: this.state.rePassword,
            phone:this.state.phone
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
                                {
                                    this.state.formFields.map(field=>{
                                       return  <TextField
                                           placeholder= {field.placeholder}
                                           name={field.name}
                                           value={this.state[field.name]}
                                           onChange={this.onChange}
                                           type={field.type}
                                           error={errors[field.name]} />
                                    })
                                }
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                                <p className=" mt-3" style={{"textAlign":"center"}}>
                                    <a href='http://localhost:5000/api/auth/google' className="btn btn-block  btn-info">Signup Using google</a>
                                    <a href='http://localhost:5000/api/auth/facebook' className="btn btn-block btn-info" >Signup Using facebook</a>
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
    googleOauth:propTypes.func.isRequired,
    facebookOauth:propTypes.func.isRequired,
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    errors: propTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { registerUser,googleOauth,facebookOauth })(withRouter(Register));