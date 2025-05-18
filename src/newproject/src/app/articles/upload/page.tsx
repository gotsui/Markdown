import { UploadForm } from "./_components/UploadForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";
import logger from "@/lib/logger";

const UploadPage: React.FC = async() => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const headersList = await headers();
    const requestUrl = headersList.get("x-request-url") || undefined;
    const userLogger = logger.child({ userId, url: requestUrl, event: "UploadPage" });
    userLogger.info({});

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