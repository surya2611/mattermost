// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo} from 'react';
import {FormattedMessage} from 'react-intl';

import {isMessageAttachmentArray} from '@mattermost/types/message_attachments';

import {usePost} from 'components/common/hooks/usePost';
import {useUser} from 'components/common/hooks/useUser';
import CommentedOnFilesMessage from 'components/post_view/commented_on_files_message';
import UserProfile from 'components/user_profile';

import {stripMarkdown} from 'utils/markdown';
import * as Utils from 'utils/utils';

type Props = {
    onCommentClick?: React.EventHandler<React.MouseEvent>;
    rootId: string;
};

function CommentedOn({onCommentClick, rootId}: Props) {
    const rootPost = usePost(rootId);
    const rootPostUser = useUser(rootPost?.user_id ?? '');

    let message: React.ReactNode = '';
    if (!rootPost) {
        message = (
            <FormattedMessage
                id='post_body.commentedOn.loadingMessage'
                defaultMessage='Loading…'
            />
        );
    } else if (rootPost.message) {
        message = Utils.replaceHtmlEntities(rootPost.message);
    } else if (rootPost.file_ids && rootPost.file_ids.length > 0) {
        message = (
            <CommentedOnFilesMessage parentPostId={rootPost.id}/>
        );
    } else if (isMessageAttachmentArray(rootPost.props?.attachments) && rootPost.props.attachments.length > 0) {
        const attachment = rootPost.props.attachments[0];
        const webhookMessage = attachment.pretext || attachment.title || attachment.text || attachment.fallback || '';
        message = Utils.replaceHtmlEntities(webhookMessage);
    }

    const parentUserProfile = (
        <UserProfile
            userId={rootPostUser?.id ?? ''}
        />
    );

    return (
        <div
            data-testid='post-link'
            className='post__link'
        >
            <span>
                <FormattedMessage
                    id='post_body.commentedOn'
                    defaultMessage="Commented on {name}'s message: "
                    values={{
                        name: <a className='theme user_name'>{parentUserProfile}</a>,
                    }}
                />
                <a
                    className='theme'
                    onClick={onCommentClick}
                >
                    {typeof message === 'string' ? stripMarkdown(message) : message}
                </a>
            </span>
        </div>
    );
}

export default memo(CommentedOn);
