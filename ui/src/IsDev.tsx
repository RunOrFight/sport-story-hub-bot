import {FC, PropsWithChildren} from "react";
import {Modal} from "antd";

const isDev = import.meta.env.DEV
const IsDev: FC<PropsWithChildren> = ({children}) => {
    if (isDev) {
        return <Modal width={'26.25rem'} footer={null} open={true}>{children}</Modal>
    }

    return children
}

export {IsDev}
