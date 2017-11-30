import React from 'react';

import session from '../SessionManager';

class Shareable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: session.isLogged(),
            sharedTime: 0
        };

        session.addLoginCallback((logged)=> {
            this.setState({ enabled: logged });
        });

        this.onButtonClick = this.onButtonClick.bind(this);
        this.isShared = this.isShared.bind(this);

    }

    isShared() {
        return this.state.sharedTime !== 0;
    }

    componentDidMount() {

    }

    onButtonClick() {

        if(this.isShared()) {
            session.removeSharedContent(this.state.sharedTime, (success) => {
                if(success)
                    this.setState({ sharedTime: 0 });
            });
        } else if(this.props.type && this.props.content) {
            session.addSharedContent(this.props.type, this.props.content, (success, time) => {
                if(success)
                    this.setState({ sharedTime: time });
            });
        }

    }

    render() {
        if(this.state.enabled) {

            let style = (this.isShared())   ? 'btn-success glyphicon-ok-sign'
                                            : 'btn-default glyphicon-share';

            return <div style={{height: '100%'}}>
                {/* React.Children.map(this.props.children, function(c){ return c;}) */ this.props.children}
                <button className={'btn glyphicon pull-right ' + style } aria-hidden='true'
                        style={{
                            position: 'relative',
                            right: '-30px',
                            top: '-30px',
                            verticalAlign: 'bottom',
                            width: '48px',
                            height: '48px',
                            borderRadius: '48px',
                            fontSize: '1.6em'
                        }}
                        onClick={this.onButtonClick}
                />
            </div>;
        } else {
            return this.props.children;
        }
    }
}

export default Shareable;