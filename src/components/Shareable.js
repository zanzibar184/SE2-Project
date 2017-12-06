import React from 'react';

import session from '../SessionManager';

class Shareable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: session.isLogged(),
            sharedTime: this.props.date,
            busy: false
        };

        session.addLoginCallback((logged)=> {
            this.setState({ enabled: logged });
        });

        this.onButtonClick = this.onButtonClick.bind(this);
        this.isShared = this.isShared.bind(this);

    }

    isShared() {
        return !!this.state.sharedTime;
    }

    componentDidMount() {

    }

    onButtonClick() {

        this.setState({busy: true});

        if(this.isShared()) {
            session.removeSharedContent(this.state.sharedTime, (success) => {
                if(success)
                     this.setState({ sharedTime: null, busy: false });
                else this.setState({ busy: false });
            });
        } else if(this.props.type && this.props.content) {
            session.addSharedContent(this.props.type, this.props.content, (success, time) => {
                if(success)
                     this.setState({ sharedTime: time, busy: false });
                else this.setState({ busy: false });
            });
        }

    }

    render() {
        if(this.state.enabled) {

            let style = (this.isShared())   ? 'btn-success glyphicon-ok-sign'
                                            : 'btn-default glyphicon-share';

            //TODO: Modificare lo stile per essere utilizzabile su più componenti e non solo su YoutubePlayer
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
                        disabled={this.state.busy}
                />
            </div>;
        } else {
            return this.props.children;
        }
    }
}

export default Shareable;