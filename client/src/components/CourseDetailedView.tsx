import api from "../utils/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import ContentForm from "./ContentForm";
import Modal from "./Modal";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRecoilValue } from "recoil";
import authState from "../utils/atoms/auth";

const CourseDetailedView: React.FC = () => {
  const { id } = useParams();
  const authenticationData = useRecoilValue(authState);
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
      const response = await api.get(`/course/${id}`);
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
      const response = await api.delete(
        `/course/${id}/content/${currentContentDeletionId}`
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
    <div className="flex flex-col md:flex-row h-[90vh] w-full bg-[#121212] text-white max-md:h-auto">
      {/* Main Content Viewer */}
      <div className="flex-1 p-4">
        <div className="rounded-lg bg-[#1E1E1E] h-[70vh] flex items-center justify-center">
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
              <div className="relative w-full h-full">
                <iframe
                  src={data.contents[currentContent]?.content?.url}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            )}
          {currentContent === null && (
            <p className="text-gray-400 text-lg">Select a content to view</p>
          )}
        </div>

        {/* Course Description and Updated At */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-gray-300">
          <p className="text-lg text-center md:text-left">
            {data?.description}
          </p>
          <p className="text-sm mt-2 md:mt-0">
            {moment(data?.updatedAt).format("YYYY/MM/DD HH:mm:ss")}
          </p>
        </div>
      </div>

      {/* Course Contents Sidebar */}
      <div className="w-full md:w-1/4 p-4 h-[90vh] bg-[#1E1E1E] shadow-md overflow-y-auto rounded-lg max-md:h-auto">
        <p className="text-lg font-semibold mb-4 text-[#FFD700]">
          Course Contents
        </p>
        {data?.contents?.map((content: any, index: number) => (
          <div
            key={index}
            className={`relative p-3 mb-2 rounded-lg cursor-pointer transition flex justify-between items-center ${
              index === currentContent
                ? "bg-[#242424] text-white"
                : "bg-[#1E1E1E] hover:bg-[#242424]"
            }`}
            onClick={() => handleContentSelection(index)}
          >
            <div>
              <p className="font-semibold">{content.topic}</p>
              <span className="text-xs font-medium border px-2 py-1 rounded bg-[#242424] text-gray-300">
                {content.contentType}
              </span>
            </div>
            {authenticationData?.user?.role === "admin" &&
              data?.owner === authenticationData?.user?._id && (
                <TrashIcon
                  className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModalVisibility(true);
                    setCurrentContentDeleteId(content._id);
                  }}
                />
              )}
          </div>
        ))}
      </div>

      {authenticationData?.user?.role === "admin" &&
        data?.owner === authenticationData?.user?._id && (
          <>
            <button
              className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 text-white bg-[#00FFAA] hover:bg-[#FFD700] rounded-full shadow-md transition cursor-pointer"
              onClick={handleButtonClick}
            >
              <PlusIcon className="w-6 h-6" />
              <span className="hidden md:inline">Add Content</span>
            </button>
            <Modal isOpen={isFormVisible}>
              <ContentForm handleCloseButton={handleButtonClick} id={id + ""} />
            </Modal>
          </>
        )}

      {authenticationData?.user?.role === "admin" &&
        data?.owner === authenticationData?.user?._id && (
          <Modal isOpen={isConfirmModalVisible}>
            <div className="rounded p-4 bg-[#1E1E1E] text-white border border-[#242424]">
              <p className="font-bold text-lg pb-4 text-[#FFD700]">
                You are proceeding to delete a content. Press{" "}
                <strong className="text-[#00FFAA]">Confirm</strong> to agree.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteContent}
                  className="hover:opacity-80 cursor-pointer bg-red-500 text-white rounded font-bold w-[100px] p-2 transition-colors duration-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setCurrentContentDeleteId(null);
                    setConfirmModalVisibility(false);
                  }}
                  className="hover:opacity-80 cursor-pointer border border-[#00FFAA] text-[#00FFAA] rounded font-bold w-[100px] p-2 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
    </div>
  );
};

export default CourseDetailedView;
