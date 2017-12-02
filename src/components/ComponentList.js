import React from 'react';

class ComponentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.addComponent = this.addComponent.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        let onUpdate = this.props.onUpdate;
        if(onUpdate && typeof onUpdate === 'function')
            onUpdate();
    }

    addComponent(component) {
        this.setState({ list: [...this.state.list, component] });
    }

    render() {
        let compList = this.state.list.map(function(component, index) {
            return <div key={index}>{component}</div>;
        });
        return (<div className={this.props.className} id={this.props.id}>{compList}</div>);
    }
}

export default ComponentList;