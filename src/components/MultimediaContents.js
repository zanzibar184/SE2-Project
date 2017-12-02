import React from 'react';

import ComponentList from './ComponentList';

class MultimediaContents extends React.Component {

    constructor(props) {
        super(props);

        this.addComponent = this.addComponent.bind(this);
        this.onListUpdated = this.onListUpdated.bind(this);

    }

    componentDidMount() {

    }

    addComponent(component) {
        this.componentList.addComponent(component);
    }

    onListUpdated() {
        let domElement = document.getElementById('multimediaContents');
        if(domElement && domElement.scrollTo)
            domElement.scrollTo(0, domElement.scrollHeight);
    }

    render() {
        return  <ComponentList id='multimediaContents' className='Scrollbar Vertical-fit' onUpdate={this.onListUpdated} ref={(instance) => {
                    this.componentList = instance;
                }}/>
    }

}

export default MultimediaContents;