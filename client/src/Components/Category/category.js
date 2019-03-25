import React, {Component} from 'react';
import Card from '../Common/Card/Cards';
import { withRouter,Link } from 'react-router-dom';
import { connect } from 'react-redux'
import {getCategories} from '../../actions/categoryAction';
class Category extends Component {
    constructor(){
        super()
        this.state={
             models:[
                {
                    thumb:'https://www.w3schools.com/howto/img_snow.jpg'
                },
                {
                    thumb:'https://www.w3schools.com/howto/img_snow.jpg'
                }
            ]
        }
    }
    componentDidMount() {
        this.props.getCategories();
    }

    render() {
        const {categories,pagination}=this.props.category;
        return (
            <div style={{marginTop:"10vh"}} className='container-fluid'>
                {
                    categories.map(category=>{
                      return (
                          <React.Fragment>
                              <Link to={`/category/${category._id}`} className="card-link">{category.name}</Link>
                              <div className='row'>
                                  {
                                      category.model.map(modelItem=>{
                                          return (
                                              <Card key={modelItem._id} thumb={category.thumb}/>
                                          )
                                      })
                                  }
                              </div>
                          </React.Fragment>
                          )

                    })
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    category: state.category,
    errors: state.errors
});



export default withRouter(connect(mapStateToProps, { getCategories })(Category));
