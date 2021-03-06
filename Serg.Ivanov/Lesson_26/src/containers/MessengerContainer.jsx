import React, { Component } from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import { push } from 'connected-react-router';

import { Messenger } from 'components/Messenger';
import { chatsLoadAction, chatsAddAction, chatsMessageSendAction, chatsFireAction, chatsUnfireAction, chatsDeleteAction } from '../actions/chats';

class MessengerContainerClass extends Component {
    componentDidMount() {
        const { chatsLoadAction, chats } = this.props;

        if (!chats.length) {
            chatsLoadAction();
        }
    }

    handleMessageSend = (message) => {
        const { chatId, chatsMessageSendAction } = this.props;

        chatsMessageSendAction({
            ...message,
            chatId,
            id: nanoid(),
        });
    }

    handleChatAdd = () => {
        const { chatsAddAction, lastId, redirect } = this.props;
        const title = prompt('Введите название чата', 'Chat1');

        if (title) {
            chatsAddAction(lastId, title);
            redirect(lastId);
        } else {
            alert('Введите название чата');
        }
    }

    handleReloadChats = () => {
        const { chatsLoadAction } = this.props;
        chatsLoadAction();
    };
    handleChatDelete = () => {
        const { chatsDeleteAction, chatId } = this.props;
        console.log(chatId);
        chatsDeleteAction(chatId);
        // if (chatId > 0) {
        //     chatsDeleteAction(chatId);
        //     redirect(chatId - 1);
        // }
        // else {
        //     chatsDeleteAction(chatId);
        //     redirect(chatId + 1);
        // };
    }
    handleChatFire = () => {
        const { chatsFireAction, chatId, title, messages, fire } = this.props;
        chatsFireAction(chatId, title, messages, fire);

    }

    handleChatUnfire = () => {
        const { chatsUnfireAction, chatId, title, messages, fire } = this.props;
        chatsUnfireAction(chatId, title, messages, fire);

    }
    render() {
        const { messages, isLoading, isError } = this.props;

        return <Messenger
            handleReloadChats={this.handleReloadChats}
            isError={isError}
            isLoading={isLoading}
            messages={messages}
            handleMessageSend={this.handleMessageSend}
            handleChatAdd={this.handleChatAdd}
            handleChatDelete={this.handleChatDelete} handleChatFire={this.handleChatFire} handleChatUnfire={this.handleChatUnfire}
        />
    }
}

function mapStateToProps(state, ownProps) {

    const { match } = ownProps;
    const chats = state.chats.entries;

    let messages = null;

    if (match && chats[match.params.id]) {
        messages = chats[match.params.id].messages;
    }

    const lastId = Object.keys(chats).length ? Object.keys(chats).length : 0;

    return {
        messages,
        chatId: match ? match.params.id : null,
        lastId,
        chats,
        isLoading: state.chats.loading,
        isError: state.chats.error,
    };
}

function mapDispatchToProps(dispacth) {
    return {
        chatsLoadAction: () => dispacth(chatsLoadAction()),
        chatsMessageSendAction: (message) => dispacth(chatsMessageSendAction(message)),
        chatsAddAction: (newChatId, title) => dispacth(chatsAddAction(newChatId, title)),
        chatsDeleteAction: (chatId) => dispacth(chatsDeleteAction(chatId)),
        redirect: (id) => dispacth(push(`/chats/${id}`)),
        chatsFireAction: (chatId, title, messages, fire) => dispacth(chatsFireAction(chatId, title, messages, fire)),
        chatsUnfireAction: (chatId, title, messages, fire) => dispacth(chatsUnfireAction(chatId, title, messages, fire)),
    };
}

export const MessengerContainer = connect(mapStateToProps, mapDispatchToProps)(MessengerContainerClass);