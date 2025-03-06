import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import ContentForm from "./ContentForm";
import Modal from "./Modal";

const CourseDetailedView: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [isFormVisible, setFormVisibility] = useState(false);
  const [currentContent, setCurrentContent] = useState<null | number>(null);
  const fetchCourse = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/v1/course/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    const status = response.status;
    if (status === 200) {
      setData(data?.data);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, []);

  const handleButtonClick = () => {
    setFormVisibility((prev: boolean) => !prev);
  };

  const handleContentSelection = (index: number) => {
    setCurrentContent(index);
  };

  return (
    <div className="flex relative h-[90vh] w-full">
      <div className="max-md:w-3/5 md:w-4/5">
        <p className="font-bold py-4 text-xl">{data?.name}</p>
        <div className="border h-[70vh]">
          {currentContent != null &&
            data?.contents[currentContent]?.contentType === "pdf" && (
              <object
                data={data?.contents[currentContent]?.content?.url}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            )}
        </div>
        <div className="flex justify-between items-center p-2">
          <p className="font-semibold py-4 text-lg text-[grey]">
            {data?.description}
          </p>
          <p>{moment(data?.updatedAt).format("YYYY/MM/DD kk:mm:ss")}</p>
        </div>
        <div></div>
      </div>
      <div className="max-md:w-2/5 md:w-1/5 p-2 h-[90vh] border scroll-smooth">
        {data?.contents?.map((content: any, index: number) => {
          return (
            <div
              className={`relative h-[70px] w-full  shadow p-2 border cursor-pointer hover:bg-[lightgrey] ${
                index === currentContent ? "bg-[lightgrey]" : ""
              }`}
              onClick={() => handleContentSelection(index)}
            >
              <p className="font-bold">{content.topic}</p>
              <div className="absolute bottom-2 right-2 border px-4">
                {content.contentType}
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="absolute bottom-4 right-8 cursor-pointer p-4 border rounded-full"
        onClick={handleButtonClick}
      >
        Add content +{" "}
      </button>
      <Modal isOpen={isFormVisible}>
        <ContentForm handleCloseButton={handleButtonClick} id={id + ""} />
      </Modal>
    </div>
  );
};

export default CourseDetailedView;
