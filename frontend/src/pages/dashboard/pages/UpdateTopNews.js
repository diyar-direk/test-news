import React, { useContext, useEffect, useState } from "react";
import "./addnews.css";
import { Context } from "../../../context/Context";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateTopNews = () => {
  const [category, setCategory] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [position, setPosition] = useState("");
  const [positionError, setPositionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [headlineError, setHeadlineError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [filesError, setFilesError] = useState(false);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/news/${params.id}`).then((res) => {
      setCategory(res.data.item.category);
      setHeadline(res.data.item.headline);
      setSummary(res.data.item.summary);
      setPosition(res.data.item.position);
      // setFiles(...res.data.item.photo,res.data.item.video);
    });
  }, []);

  function handleClick(e) {
    e.stopPropagation();
    document
      .querySelector(
        "div.main .dashboard-container form.add-news .select-category"
      )
      .classList.toggle("active");
  }

  const context = useContext(Context);
  const language = context.langValue;
  const dataType = context.dataType.map((e, index) => {
    return (
      <p onClick={handelSelect} key={index} data-type={e.toLowerCase()}>
        {e}
      </p>
    );
  });

  document.body.addEventListener("click", () => {
    const catDiv = document.querySelector(
      "div.main .dashboard-container form.add-news .select-category.active"
    );
    if (document.body.contains(catDiv)) catDiv.classList.remove("active");
  });

  function handelSelect(e) {
    setCategory(e.target.dataset.type);
  }

  function handelFiles(e) {
    const selectedFiles = Array.from(e.target.files);

    const images = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videos = selectedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (images.length > 3 || videos.length > 1) {
      setErrorMessage("Please upload exactly 3 images and 1 video.");
      return;
    }

    setErrorMessage("");

    setFiles([...images, ...videos]);
  }
  const formData = new FormData();

  formData.append("category", category);
  formData.append("headline", headline);
  formData.append("summary", summary);

  files.forEach((e, index) => {
    e.type.startsWith("image/")
      ? formData.append("photo", e)
      : formData.append("video", e);
  });
  function handelSubmit() {
    if (category === "") setCategoryError(true);
    else if (headline === "") setHeadlineError(true);
    else if (summary === "") setSummaryError(true);
    else if (position === "") setPositionError(true);
    else if (files.length <= 0) setFilesError(true);
  }
  return (
    <div className="main">
      <div className="dashboard-container center">
        <form className="add-news">
          <label
            htmlFor="category"
            onClick={(e) => {
              e.stopPropagation();
              document
                .querySelector(
                  "div.main .dashboard-container form.add-news .select-category"
                )
                .classList.toggle("active");
            }}
          >
            {language && language.dashboard.forms.category}
          </label>
          <div className="no-wrap">
            <input
              onInput={(e) => {
                setCategory(e.target.value);
                setCategoryError(false);
              }}
              className="flex-1 "
              type="text"
              name="category"
              value={category}
              placeholder={language && language.dashboard.forms.category}
              id="category"
            />
            <i className="fa-solid fa-chevron-down" onClick={handleClick}></i>
            <div className="select-category">
              {dataType}
              <span>{language && language.dashboard.forms.add}</span>
            </div>
          </div>

          {categoryError && (
            <p className="error">
              {language && language.dashboard.forms.errorCategory}
            </p>
          )}

          <label htmlFor="headline">
            {language && language.dashboard.forms.headline}
          </label>
          <input
            onInput={(e) => {
              setHeadline(e.target.value);
              setHeadlineError(false);
            }}
            value={headline}
            name="headline"
            type="text"
            placeholder={language && language.dashboard.forms.headline}
            id="headline"
          />

          {headlineError && (
            <p className="error">
              {language && language.dashboard.forms.errorHeadline}
            </p>
          )}

          <label
            htmlFor="summray"
            onClick={() => {
              document.querySelector("textarea").focus();
            }}
          >
            {language && language.dashboard.forms.summary}
          </label>
          <textarea
            onInput={(e) => {
              setSummary(e.target.value);
              setSummaryError(false);
            }}
            value={summary}
            name="summary"
            type="text"
            placeholder={language && language.dashboard.forms.summary}
            id="summary"
            rows={3}
          ></textarea>

          {summaryError && (
            <p className="error">
              {language && language.dashboard.forms.errorSummary}
            </p>
          )}

          <label htmlFor="position">
            {language && language.dashboard.forms.position}
          </label>
          <input
            name="position"
            type="number"
            placeholder={language && language.dashboard.forms.position}
            id="position"
            max={5}
            min={1}
            value={position}
            onChange={(e) => {
              setPosition(e.target.value);
              setPositionError(false);
            }}
          />

          {positionError && (
            <p className="error">{language.dashboard.forms.errorPosition}</p>
          )}

          <label htmlFor="file">
            {language && language.dashboard.forms.files}
          </label>
          <label
            htmlFor="file"
            className="file"
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <input
              onChange={handelFiles}
              id="file"
              type="file"
              accept="image/*,video/*"
              multiple
            />
            <i className="fa-solid fa-photo-film"></i>
          </label>

          {filesError && (
            <p className="error">
              {language && language.dashboard.forms.errorFiles}
            </p>
          )}

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div className="file-flex">
            {files.map((file, index) => (
              <div key={index}>
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file)} alt="uploaded" />
                ) : (
                  <video src={URL.createObjectURL(file)} controls />
                )}
              </div>
            ))}
          </div>

          <div className="submit" onClick={handelSubmit}>
            {language && language.dashboard.forms.create}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTopNews;
