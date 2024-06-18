import NewsPublish from "../../../components/publish-manage/NewsPublish.jsx";
import usePublish from "../../../components/publish-manage/usePublish.jsx";
import {Button} from "antd";

export default function Published() {

    // 调用 hooks 请求数据
    // 2 已发布
    const {dataSource, handleSunset} = usePublish(2)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)}>
                下线
            </Button>}></NewsPublish>
        </div>
    )
}
