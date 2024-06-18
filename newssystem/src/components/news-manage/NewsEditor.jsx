import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {useEffect, useState} from "react";

// 解决不能用
// https://github.com/jpuri/react-draft-wysiwyg/issues/1092#issuecomment-1170189460

export default function NewsEditor(props) {
    useEffect(() => {
        // console.log(props.content);
        // html =====> draft
        const html = props.content;
        // 如果是创建新闻，没传 content 直接返回
        if (html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props.content]);

    const [editorState, setEditorState] = useState("");

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    props?.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}