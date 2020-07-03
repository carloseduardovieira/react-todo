import React, {Component} from 'react';
import axios from 'axios';

import PageHeader from '../template/page-header';
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:3003/api/todos';

class Todo extends Component {

  constructor(props) {
    super(props);
    this.handleAdd =            this.handleAdd.bind(this);
    this.handleChange =         this.handleChange.bind(this);
    this.handleRemove =         this.handleRemove.bind(this);
    this.handleMarkAsDone =     this.handleMarkAsDone.bind(this);
    this.handleMarkAsPending =  this.handleMarkAsPending.bind(this);
    this.state =                { description: '', list: [] };

    this.refresh();
  }

  handleAdd() {
    const description = this.state.description;
    axios.post(URL, {description})
    .then((resp) => {
      const updatedList = [...this.state.list];
      updatedList.unshift(resp.data);
      this.setState({...this.state, description:'', list: updatedList});
    });
  }

  handleChange(e) {
    this.setState({...this.state, description: e.target.value});
  }

  handleMarkAsDone(todo) {
    axios.put(`${URL}/${todo._id}`, {...todo, done: true})
    .then(resp => {
      this.state.list.map( li => {
        if ( li._id === todo._id ){
          li.done = true;
        }
        return li;
      });
      this.setState({...this.state, description:'', list: this.state.list});
    })
  }

  handleMarkAsPending(todo) {
    axios.put(`${URL}/${todo._id}`, {...todo, done: false})
    .then(resp => {
      this.state.list.map( li => {
        if ( li._id === todo._id ){
          li.done = false;
        }
        return li;
      });
      this.setState({...this.state, description:'', list: this.state.list});
    })
  }

  handleRemove( todo ) {
    if ( !todo.done ) { return; }
    axios.delete(`${URL}/${todo._id}`)
    .then(resp => {
      this.state.list = this.state.list.filter(sl => sl._id !== todo._id);
      this.setState({...this.state, list: this.state.list});
    });
  }

  refresh() {
    axios.get(`${URL}?sort=-createdAt`)
    .then(resp => this.setState({ ...this.state, description: '', list: resp.data }));
  }

  render () {
    return (
      <div>
        <PageHeader
          name="Tarefas"
          small="Cadastro"/>

        <TodoForm
          handleAdd={this.handleAdd} 
          handleChange={this.handleChange}
          description={this.state.description} />

        <TodoList 
          list={this.state.list}
          handleRemove={this.handleRemove}
          handleMarkAsDone={this.handleMarkAsDone}
          handleMarkAsPending={this.handleMarkAsPending} />
      </div>
    );
  }
}

export default Todo;
