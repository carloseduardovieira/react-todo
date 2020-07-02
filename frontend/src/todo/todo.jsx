import React, {Component} from 'react';
import axios from 'axios';

import PageHeader from '../template/page-header';
import TodoForm from './todoForm';
import TodoList from './todoList';

const URL = 'http://localhost:3003/api/todos';

class Todo extends Component {

  constructor(props) {
    super(props);
    this.handleAdd =    this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.state =        { description: '', list: [] };

    this.refresh();
  }

  handleAdd() {
    const description = this.state.description;
    axios.post(URL, {description})
    .then((resp) => {
      const updatedList = [...this.state.list];
      updatedList.unshift(resp.data)
      this.setState({...this.state, description:'', list: updatedList})
    });
  }

  handleChange(e) {
    this.setState({...this.state, description: e.target.value})
  }

  handleRemove(todo) {
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
            handleRemove={this.handleRemove} />
      </div>
    );
  }
}

export default Todo;
