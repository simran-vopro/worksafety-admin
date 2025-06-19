import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (files: File[]) => void;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
      <form
        {...getRootProps()}
        className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
          ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }
        `}
        id="demo-upload"
      >
        <input {...getInputProps()} />

        <div className="dz-message flex flex-col items-center">
          {/* Upload icon and text here */}
          <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl text-center dark:text-white/90">
            {isDragActive ? "Drop Files Here" : "Drag & Drop CSV or Excel Files Here"}
          </h4>
          <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
            Only .csv, .xls, or .xlsx files are supported
          </span>
          <span className="font-medium underline text-theme-sm text-brand-500">
            Browse File
          </span>
        </div>
      </form>
    </div>
  );
};

export default DropzoneComponent;
