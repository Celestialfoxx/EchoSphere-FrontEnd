import React, { Component, createRef } from "react";
import { Modal, Button, message } from "antd";
import { PostForm } from "./PostForm";
import axios from "axios";

import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
 state = {
   visible: false,
   confirmLoading: false
 };

 showModal = () => {
   this.setState({
     visible: true
   });
 };

 handleOk = () => {
   this.setState({
     confirmLoading: true
   });

   // get form data
   this.postForm
     //查看是否所有必须要填的部分有value
     .validateFields()
     .then((form) => {
        //从form中拿到上传的信息
       const { description, uploadPost } = form;
       const { type, originFileObj } = uploadPost[0];
       const postType = type.match(/^(image|video)/g)[0];
       //如果上传的类型已经被定义了
       if (postType) {
        //JS自带的formData的Api
         let formData = new FormData();
         formData.append("message", description);
         formData.append("media_file", originFileObj);

         const opt = {
           method: "POST",
           url: `${BASE_URL}/upload`,
           headers: {
             Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
           },
           data: formData
         };

         axios(opt)
           .then((res) => {
             if (res.status === 200) {
               message.success("Successfully uploaded!");
               //清空form
               this.postForm.resetFields();
               //关闭上传界面
               this.handleCancel();
               //如果上传image自动转到image界面
               this.props.onShowPost(postType);
               //不再loading
               this.setState({ confirmLoading: false });
             }
           })
           .catch((err) => {
             console.log("Upload failed: ", err.message);
             message.error("Failed to upload");
             this.setState({ confirmLoading: false });
           });
       }
     })
     .catch((err) => {
       console.log("err ir validate form -> ", err);
     });
 };

 handleCancel = () => {
   console.log("Clicked cancel button");
   this.setState({
     visible: false
   });
 };

 render() {
   const { visible, confirmLoading } = this.state;
   return (
     <div>
       <Button type="primary" onClick={this.showModal}>
         New Post
       </Button>
       <Modal
         title="Upload a New Post"
         visible={visible}
         onOk={this.handleOk}
         okText="Upload"
         confirmLoading={confirmLoading}
         onCancel={this.handleCancel}
       >
        <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
       </Modal>
     </div>
   );
 }
}
export default CreatePostButton;