import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import ContentForm from "./ContentForm";
import Modal from "./Modal";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const CourseDetailedView: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [isFormVisible, setFormVisibility] = useState(false);
  const [currentContent, setCurrentContent] = useState<null | number>(null);
  const [isConfirmModalVisible, setConfirmModalVisibility] =
    useState<boolean>(false);
  const [currentContentDeletionId, setCurrentContentDeleteId] = useState<
    null | string
  >(null);
  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/course/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) setData(response.data?.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleButtonClick = () => setFormVisibility((prev) => !prev);
  const handleContentSelection = (index: number) => setCurrentContent(index);

  const handleDeleteContent = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/course/${id}/content/${currentContentDeletionId}`,
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error(response?.data?.message);
      }
      fetchCourse();
    } catch (error) {
      console.error("Error deleting content:", error);
    } finally {
      setCurrentContentDeleteId(null);
      setConfirmModalVisibility(false);
    }
  };

  return (
    <div className="flex h-[90vh] w-full bg-neutral-900 text-white">
      <div className="flex flex-col w-4/5 max-md:w-3/5 p-4">
        <div className="rounded-lg bg-neutral-800 h-[70vh] flex items-center justify-center">
          {currentContent !== null &&
            data?.contents?.[currentContent]?.contentType === "pdf" && (
              <object
                data={data.contents[currentContent]?.content?.url}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            )}
          {currentContent !== null &&
            data?.contents?.[currentContent]?.contentType === "video" && (
              <iframe
                src={data.contents[currentContent]?.content?.url}
                className="w-full h-full"
                allowFullScreen
              />
            )}
          {currentContent === null && (
            <p className="text-gray-400 text-lg">Select a content to view</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 text-gray-300">
          <p className="text-lg">{data?.description}</p>
          <p className="text-sm">
            {moment(data?.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
          </p>
        </div>
      </div>

      <div className="w-1/5 max-md:w-2/5 p-4 h-[90vh] bg-neutral-800 shadow-md overflow-y-auto rounded-lg">
        <p className="text-lg font-semibold mb-4">Course Contents</p>
        {data?.contents?.map((content: any, index: number) => (
          <div
            key={index}
            className={`relative p-3 mb-2 rounded-lg cursor-pointer transition flex justify-between items-center ${
              index === currentContent
                ? "bg-neutral-700 text-white"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
            onClick={() => handleContentSelection(index)}
          >
            <div>
              <p className="font-semibold">{content.topic}</p>
              <span className="text-xs font-medium border px-2 py-1 rounded bg-neutral-700 text-gray-300">
                {content.contentType}
              </span>
            </div>
            <TrashIcon
              className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                setConfirmModalVisibility(true);
                setCurrentContentDeleteId(content._id);
              }}
            />
          </div>
        ))}
      </div>

      <button
        className="absolute bottom-6 right-8 flex items-center gap-2 px-6 py-3 text-white bg-neutral-800 hover:bg-neutral-700 rounded-full shadow-md transition cursor-pointer"
        onClick={handleButtonClick}
      >
        <PlusIcon className="w-6 h-6" />
        Add Content
      </button>
      <div className="text-black">
        <Modal isOpen={isFormVisible}>
          <ContentForm handleCloseButton={handleButtonClick} id={id + ""} />
        </Modal>
      </div>
      <Modal isOpen={isConfirmModalVisible}>
        <div className="rounded p-2 text-black">
          <p className="font-bold text-lg pb-4">
            You are proceding to delete a content, Press{" "}
            <strong>confirm</strong> to agree
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteContent}
              className="hover:opacity-50 cursor-pointer bg-red-500 text-white rounded font-bold w-[100px] p-2"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setCurrentContentDeleteId(null);
                setConfirmModalVisibility(false);
              }}
              className="hover:opacity-50 cursor-pointer border border-[black] rounded font-bold w-[100px] p-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetailedView;
