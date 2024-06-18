import NewsPublish from "../../../components/publish-manage/NewsPublish.jsx";
import usePublish from "../../../components/publish-manage/usePublish.jsx";
import {Button} from "antd";

export default function Unpublished() {

    // 使用自定义 hooks 请求数据
    // 1 待发布
    const {dataSource, handlePublish} = usePublish(1);

    return (
        <div>
            <NewsPublish dataSource={dataSource}
                         button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>
                             发布
                         </Button>}></NewsPublish>
        </div>
    )
}
