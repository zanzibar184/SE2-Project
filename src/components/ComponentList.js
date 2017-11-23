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

    addComponent(component) {
        this.setState({ list: [...this.state.list, component] });
    }

    render() {
        var compList = this.state.list.map(function(component, index) {
            return <div key={index}>{component}</div>;
        });
        return (<div>{compList}</div>);
    }
}

export default ComponentList;