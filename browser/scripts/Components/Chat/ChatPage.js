import React from 'react';
import Sidebar from './Sidebar';
import ChatStore from '../../Store/ChatStore';
import MessageComposer from './MessageComposer';

function _getStateFromStore() {
    return ChatStore.getState();
};

export default class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = _getStateFromStore();
    }

    componentWillMount() {
        ChatStore.listen(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
        ChatStore.unlisten(this.onStoreChange.bind(this));
    }

    onStoreChange() {
        this.setState(_getStateFromStore);
    }

    componentWillUpdate() {
        let node = React.findDOMNode(this.refs.chatscreen);
    }

    componentDidUpdate() {
        let node = React.findDOMNode(this.refs.chatscreen);
        node.scrollTop = node.scrollHeight;
        console.log(this.state);
    }

    render() {
        let messages;
        console.log(this.state.messages);
        if(this.state.messages === undefined) {
            messages = <div className="chat-row"><div className="chat-item"><h3>Server</h3> <p>Er zijn nog geen berichten.</p></div></div>;
        } else {
            messages = this.state.messages.map((item) => {
                if(item.user === this.state.currentUser) {
                    return <div className="chat-row"><div key={item.user} className="chat-item self"><h3>{item.user}</h3> <p>{item.message}</p></div></div>;
                }
                return <div className="chat-row"><div className="chat-item" key={item.user}><h3>{item.user}</h3> <p>{item.message}</p></div></div>;
            });
        }


        return (
            <section id="chatpage">
                <Sidebar users={this.state.users} />
                <section id="chat" ref="chatscreen">
                    {messages}
                </section>
                <MessageComposer handleSendMessage={this._handleSendMessage.bind(this)} />
            </section>
        )
    }

    _handleSendMessage(data) {

        var result = {
            user: this.state.currentUser,
            message: data
        };
        this.props.handleSendMessage(result);
    }
}
