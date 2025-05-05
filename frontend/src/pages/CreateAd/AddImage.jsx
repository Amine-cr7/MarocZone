import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPhotos } from '../../features/ads/adsSlice';
import { useNavigate } from 'react-router-dom';

export default function AddImage() {
    const { ad } = useSelector(state => state.ads);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        setImages(e.target.files); // files is a FileList
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!images.length) {
            alert("Please select images");
            return;
        }
        const formData = new FormData();
        // 👇 IMPORTANT: use same key as backend expects (req.files.files)
        for (let i = 0; i < images.length; i++) {
            formData.append('files', images[i]); // 👈️ backend katsenna 'files'
        }
        dispatch(uploadPhotos({ id: ad._id, photos: formData }));
        navigate("/")
    };

    return (
        <div>
            <h2>Upload Images for Ad: {ad._id}</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
