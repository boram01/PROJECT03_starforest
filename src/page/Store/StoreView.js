import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Tabs from "../../components/Store/Tabs";
import StoreToggle from "../../components/Store/StoreToggle";
import EventSwiper from "../../components/Store/EventSwiper";
import StoreTopTen from "../../components/Store/StoreTopTen";
import Icon from "../../components/Icon/Icon";
import "../../assets/css/storeStyle.scss";
import ModalContext from "../../components/Modal/ModalContext";
import Button from "../../components/Form/Button";
import PurchaseModal from "../../components/Store/PurchaseModal";
import ReviewList from "../../components/Store/ReviewList";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import ModalStore from "../../components/Modal/ModalStore";

const host = `${process.env.REACT_APP_SERVER_URL}`;
const productview = {
  id: 1,
  brand: "브랜드",
  brand_name: "브랜드명1",
  product_name: "상품명 블라블라 1",
  Category: "캠핑텐트",
  price: 1000000,
  image: "imgdefault.png",
  sales_volume: "30%",
  saledPrice: "700,000원",
  point: "적립금",
  pointDetails: "구매액의 1%",
  delivery: "배송",
  deliveryDetails: "무료배송 / 택배사(CJ대한통운)",
};

const tabBar = [
  { id: "details", name: "상세정보" },
  { id: "reviews", name: "리뷰보기" },
];

const detailView = {
  detailImg: "미라클스크린텐트.jpg",
};

const reviewsArr = [
  {
    id: 1,
    img: "imgdefault.png",
    level: "lavel lavel01",
    name: "샛별",
    user: "웅크린양과같은사나이",
    content: "리뷰리뷰리뷰리뷰리뷰리뷰",
  },
  {
    id: 2,
    img: "imgdefault.png",
    level: "lavel lavel03",
    name: "뭇별",
    user: "웅크린양과같은사나이",
    content: "리뷰리뷰리뷰리뷰리뷰리뷰",
  },
];

function StoreView(props) {
  const loginState = useSelector((state) => state.loginSlice);

  const { productId } = useParams(); //URL파라미터에서 상품ID를 찾아서 가져옴
  const [product, setProduct] = useState({});
  const [detailView, setDetailView] = useState();
  const [reviewList, setReviewList] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tabBar[0].id);
  const [showFullImage, setShowFulllImage] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [modalData, setModalData] = useState({ product_name: "", price: 0 });
  const [detailImage, setDetailImage] = useState("default-image.jpg");
  const [loading, setLoading] = useState(true);

  // const { modalOpen } = useContext(ModalContext);
  const navigate = useNavigate();
  const usePurchaseMove = () => {
    navigate(`/store/pay/${productId}`);
  };

  const getProductType = (type) => {
    switch (type) {
      case 0:
        return "텐트";
      case 1:
        return "음식";
      case 2:
        return "DIY";
      default:
        return "알 수 없음";
    }
  };

  //axios________________________________________________________________________________
  // const handleButtonClick = async () => {
  //   if (product) {
  //     try {
  //       const cartItem = {
  //         product_id: product.productId,
  //         quantity: 1,
  //         user_email: loginState.email,
  //         result: false,
  //       };
  //       console.log("최보람은 바보다.");
  //       console.log(cartItem);

  //       // 장바구니에 상품 추가
  //       const response = await axios.post(
  //         `${host}store/cart/add`,
  //         // quantityData
  //         cartItem
  //       );
  //       console.log("Item added to cart", response.data);
  //       // 장바구니에 추가 성공 후, 모달 표시
  //       setModalData({
  //         product_name: product.productName,
  //         price: product.price,
  //       });
  //       setShowModal(true);
  //     } catch (error) {
  //       console.error("Error adding item to cart", error);
  //       setError("장바구니에 상품을 추가하는 데 실패했습니다");
  //     }
  //   }
  // };

  const fetchStoreDetail = async () => {
    try {
      const res = await axios.get(`${host}store/view/${productId}`);
      console.log(res.data);
      setProduct(res.data);
      setDetailView(res.data.imageList);
      const image = res.data.imageList[0];
      if (image) {
        setDetailImage(image);
      }
    } catch (error) {
      console.error("Error fetching store detail", error);
      setError("상품 정보를 불러오는데 실패했습니다.");
    }
  };
  //처음 렌더링되거나 id값이 변경될때 실행
  //상품세부정보가져오기
  useEffect(() => {
    fetchStoreDetail();
    fetchReviews();
  }, [productId]);

  //리뷰가져오기
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${host}store/view/review/${productId}`);
      console.log(res.data);
      setReviewList(res.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      setError("리뷰를 불러오는데 실패했습니다.");
    }
  };

  //리뷰삭제
  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`${host}reviews/delete/${reviewId}`);
      setReviewList((prevReviewList) =>
        prevReviewList.filter((review) => review.id !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("리뷰 삭제에 실패했습니다.");
    }
  };

  //__________________________________________________________________________________________

  //탭메뉴
  const changeTab = (tabId) => {
    setActiveTab(tabId);
    setShowFulllImage(false);
  };

  const changeUnderLine = (e) => {
    setActiveTab(e.target.value);
  };

  //상세정보
  const toggleImage = () => {
    setShowFulllImage(!showFullImage);
  };

  const [defaultView, setDefaultView] = useState({
    detailImg: "default-image.jpg",
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        if (!detailView) {
          return <div>Loading...</div>;
        }
        return (
          <div className="detailContent">
            <div
              className="detailImageWrapper"
              style={{
                overflow: "hidden",
                height: showFullImage ? "auto" : "678px",
              }}
            >
              <img
                className="detailImg"
                src={product.imageList[0]}
                alt="상품 상세 이미지"
                style={{ width: "100%", height: "auto" }}
              />
              <button onClick={toggleImage} className="moreBtn">
                {showFullImage ? "접기" : "상품설명 더보기"}
              </button>
            </div>
          </div>
        );
      case "reviews":
        return <ReviewList reviews={reviewList} onDelete={deleteReview} />;

      default:
        return null;
    }
  };

  return (
    <div className="storeViewWrap">
      <div className="productImageWrap">
        {product.imageList && product.imageList.length > 1 && (
          <div className="campViewSwiper">
            {console.log(product.imageList)}
            <Swiper
              modules={[Pagination, A11y]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={true}
            >
              {product.imageList.slice(1).map((item, index) => (
                <SwiperSlide key={index}>
                  <img src={item} alt={`상품 상세 이미지 ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className="productNameWrap">
          <div className="nameWrap">
            {/* <p className="category">{productview.Category}</p> */}
            <p className="category">{getProductType(product.type)}</p>
            {/* <h1 className="productName">{productview.productName}</h1> */}
            <h1 className="productName">{product.productName}</h1>
          </div>

          <div className="brandWrap">
            <Icon iconName="iconBrend" />
            <p className="brand"> {productview.brand} </p>
            <p className="brandName">{product.brandName}</p>
          </div>
        </div>
      </div>
      <div className="productPriceWrap">
        <div className="priceWrap">
          {product.price
            ? (Math.floor(product.price / 0.7 / 1000) * 1000).toLocaleString()
            : 0}
          원
        </div>
        <div className="saleWrap">
          <p className="sale">{productview.sales_volume}</p>
          <p className="saleprice">
            {product.price ? product.price.toLocaleString() : 0}원
          </p>
        </div>
      </div>
      <div className="productViewEtc">
        <div className="pointWrap">
          <Icon iconName="iconBrend" />
          <p className="point">{productview.point}</p>
          <p className="pointDetails">{productview.pointDetails}</p>
        </div>
        <div className="deliveryWrap">
          <div className="iconDeliverySet">
            <Icon iconName="iconBrend" />
            <p className="delivery">{productview.delivery}</p>
          </div>
          <p className="deliveryDetails">{productview.deliveryDetails}</p>
        </div>
      </div>
      {/* -------------------------------------------------------------------- */}

      <div className="buyWrap">
        <Button defaultBtn={true} onClick={usePurchaseMove}>
          구매하기
        </Button>
      </div>
      <div>
        <div className="tabMenuWrap">
          <ul className="tabList">
            {tabBar.map((tab) => (
              <li
                key={tab.id}
                className={activeTab === tab.id ? "on" : ""}
                onClick={() => changeTab(tab.id)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="tabContent">{renderTabContent()}</div>
      </div>
      <div className="toggle">
        <StoreToggle className="toggleWrap" title="교환ㆍ반품 안내">
          <div className="togglecontentWrap">
            <p className="togglecontent">교환ㆍ반품비</p>
            <p className="productReference">편도 4,000원</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">색상</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="productReference">
              *[마이 &gt; 내쇼핑 &gt; 주문내역]에서 신청 가능합니다.
            </p>
            <p className="productReference">
              *최초 무료 배송 상품의 경우 반품 시 왕복 배송비가 부과됩니다
            </p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">교환ㆍ반품 배송지</p>
            <p className="productReference">
              [08503] 서울 금천구 가산디지털2로 144 현대테라타워{" "}
            </p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">교환ㆍ반품 신청 가능 기간</p>
            <p className="productReference">
              -구매자 단순 변심은 상품 수령후 7일 이내 (구매자 반품 배송비 부담)
            </p>
            <p className="productReference">
              -표시ㆍ광고와 상이, 계약 내용과 다르게 이행된 경우 상품 수령 후{" "}
              <br />
              3개월 이내 혹은 표시ㆍ광고와 다른 사실을 안 날로부터 30일 이내{" "}
              <br />
              (판매자 반품 배송비 부담) 둘 중 하나 경과시 반품ㆍ교환 불가
            </p>
          </div>
        </StoreToggle>
      </div>
      <div className="toggle">
        <StoreToggle className="toggleWrap" title="상품 정보 고시">
          <div className="togglecontentWrap">
            <p className="togglecontent">제품 소재</p>
            <p className="productReference">상품상세 참초</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">색상</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">치수</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">제품구성</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">제조자</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">제조국</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">세탁방법 및 취급시 주의사항</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent">품질보증기준</p>
            <p className="productReference">상품상세 참조</p>
          </div>
          <div className="togglecontentWrap">
            <p className="togglecontent"> A/S 책임자와 전화번호</p>
            <p className="productReference">상품상세 참조</p>
          </div>
        </StoreToggle>
      </div>
      <div className="storeTop">
        <StoreTopTen />
      </div>
    </div>
  );
}

export default StoreView;
