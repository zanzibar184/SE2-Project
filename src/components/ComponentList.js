import React from 'react';

class ComponentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.addComponent = this.addComponent.bind(this);
        this.remComponent = this.remComponent.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        let onUpdate = this.props.onUpdate;
        if(onUpdate && typeof onUpdate === 'function')
            onUpdate();
    }

    addComponent(component, key) {
        this.setState({ list: [...this.state.list, {element:component, key:key}] });
    }

    remComponent(key) {
        let newList = this.state.list;
        for(let i = 0; i < newList.length; ++i) {
            let e = newList[i];
            if(e.key === key) {
                newList.splice(i, 1);
                this.setState({list: newList});
                return;
            }
        }
    }

    render() {
        let compList = this.state.list.map(function(component, index) {
            return <div key={(component.key)?component.key:index}>{component.element}</div>;
        });
        return (<div className={this.props.className} id={this.props.id}>{compList}</div>);
    }
}

export default ComponentList;