import { UploadForm } from "./_components/UploadForm";

const UploadPage = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg-px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mt-6">
                    <UploadForm />
                </div>
            </div>
        </div>
    );
};

export default UploadPage;