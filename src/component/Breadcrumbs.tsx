import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import tn_image from "../../public/tn_map.svg";
import { useDispatch } from "react-redux";
import {
  handleBreadCrumClick,
  handleResetMap,
} from "../store/slices/mapViewSlice";
import { MapType } from "../constants/enum";

interface BreadcrumbsDetails {
  mapState?: any;
  isVertical?: boolean;
}

const Breadcrumbs = ({ mapState, isVertical = true }: BreadcrumbsDetails) => {
  const dispatch = useDispatch();
  const onBreadcrumbClick = ({ key, mapState }: any) => {
    dispatch(handleBreadCrumClick({ type: key, mapState: mapState }));
  };

  const isRootLevel = (key: string) =>
    [MapType.STATE, MapType.ZONE].includes(key as MapType);

  const renderSeparator = () =>
    isVertical ? (
      <FaCaretRight className="text-xl text-red-600 5xl:text-3xl" />
    ) : (
      <FaCaretDown className="text-xl text-red-600 5xl:text-3xl" />
    );
  const handleResetMaps = (mapType: any) => {
    console.log(mapType, "mapType");
    dispatch(handleResetMap({ type: mapType }));
  };

  return (
    <div
      className={`flex  p-2 ${
        isVertical && "flex-row"
      } items-center justify-center space-x-2`}
    >
      <img
        aria-label="state_breadcrumb"
        src={tn_image}
        width={35}
        height={35}
        alt=""
        onClick={() => handleResetMaps(mapState?.rootMapType)}
      />
      {mapState.breadCrumbDetails &&
        Object.keys(mapState?.breadCrumbDetails).map(
          (key: string, index, array) => {
            const value = mapState?.breadCrumbDetails![key];
            const isLastItem = index !== array.length - 1;
            console.log(key, "value");
            return (
              <div
                className={`flex gap-1 $${
                  isVertical && "flex-col"
                } items-center justify-center`}
                key={key}
              >
                <div
                  onClick={() =>
                    isLastItem ? onBreadcrumbClick({ key, mapState }) : {}
                  }
                  className="cursor-pointer rounded p-1 text-center text-[0.95rem] font-semibold uppercase 5xl:text-[1.8rem]"
                >
                  {Object.entries(mapState?.breadCrumbDetails).length ===
                  0 ? null : isRootLevel(key) ? (
                    <div className="flex items-center gap-2">
                      <FaCaretRight className="text-xl text-red-600 5xl:text-3xl" />
                      {renderBreadCrumbsLabel(value)}
                    </div>
                  ) : (
                    renderBreadCrumbsLabel(value)
                  )}
                </div>
                {isLastItem && renderSeparator()}
              </div>
            );
          }
        )}
      {/* Root Level */}
    </div>
  );
};

const renderBreadCrumbsLabel = (value: string) => {
  return value ? (
    <div
      className="flex gap-2 rounded-r-full bg-[#1673bb] text-white"
      style={{ boxShadow: "0 0 5px 2px lightgrey", padding: "0.45rem" }}
    >
      <span className="font-semibold capitalize" aria-label={`${value}`}>
        {value}
      </span>
    </div>
  ) : (
    <></>
  );
};

export default Breadcrumbs;
