import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, message, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { BASE_URL, TOKEN_KEY } from "../constants";


const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  maxHeight: "240px",
  overflow: "hidden",
  position: "absolute",
  bottom: "0",
  width: "100%",
  color: "white",
  padding: "2px",
  fontSize: "90%",
};


const wrapperStyle = {
  display: "block",
  minHeight: "1px",
  width: "100%",
  border: "1px solid #ddd",
  overflow: "auto",
};


function PhotoGallery(props) {
  const [images, setImages] = useState(props.images);


  const imageArr = images.map((image) => {
    return {
      //拿到Home.js中定义的image的参数， 并展开
      ...image,
      customOverlay: (
        <div style={captionStyle}>
          <div
          >{`${image.user}: ${image.caption}`}</div>
          <Button
            style={{ marginTop: "10px", marginLeft: "5px" }}
            key="deleteImage"
            type="primary"
            icon={<CloseOutlined />}
            size="small"
            onClick={() => onDeleteImage(image.postId)}
          >
            Delete
          </Button>
        </div>
      ),
    };
  });


  const onDeleteImage = (postId) => {
    if (window.confirm(`Confirm to delete this image`)) {
      const newImageArr = images.filter((img) => img.postId !== postId);
      console.log("delete image ", newImageArr);
      const opt = {
        method: "DELETE",
        url: `${BASE_URL}/post/${postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      };


      axios(opt)
        .then((res) => {
          console.log("delete result -> ", res);
          // case1: success
          if (res.status === 200) {
            // step1: set state
            setImages(newImageArr);
          }
        })
        .catch((err) => {
          // case2: fail
          message.error("Delete failed!");
          console.log("fetch posts failed: ", err.message);
        });
    }
  };


  useEffect(() => {
    setImages(props.images);
  }, [props.images]);


  return (
    <div style={wrapperStyle}>
      <Gallery
        images={imageArr}
        enableImageSelection={false}
        backdropClosesModal={true}
      />
    </div>
  );
}


PhotoGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      postId: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      thumbnailWidth: PropTypes.number.isRequired,
      thumbnailHeight: PropTypes.number.isRequired,
    })
  ).isRequired,
};


export default PhotoGallery;