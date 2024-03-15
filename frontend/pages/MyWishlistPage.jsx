import React from "react";
/* ----------------------------------------------------------------------------------------------------- */
/*  @ Components Import.
/* ----------------------------------------------------------------------------------------------------- */
import AnimationView from "../components/common/AnimationView";
import { Link } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Header from "../components/common/Header";
import Hero from "../components/common/Hero";
import Footer from "../components/common/Footer";
import { Tabs } from "../components/MyProfilePageComponents/MyProTabs";
import FakeProdImg from "../assets/fakeprod.png";
import placeholderImg from "../assets/placeholderImg-Small.jpeg";
import { formatDate } from "./MyOrderPage";
import Button from "../components/common/Button";
import { BsArrowRightCircle, BsTrash3 } from "react-icons/bs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import NoDataFound from "../components/common/NoDataFound";
import { PiShirtFoldedFill } from "react-icons/pi";

import {
  ConnectButton,
  ConnectDialog,
  useCanister,
  useConnect,
  useDialog,
} from "@connect2ic/react";
import IcpLogo from "../assets/IcpLogo";
import EmptyWishlist from "../components/common/EmptyWishlist";

/* ----------------------------------------------------------------------------------------------------- */
/*  @ Base Components.
/* ----------------------------------------------------------------------------------------------------- */
const MyWishlistPage = () => {
  return (
    <AnimationView>
      <ScrollToTop />
      <Header title={"Wishlist"}></Header>
      <MyWishListContainerMain />
      <Footer></Footer>
    </AnimationView>
  );
};

/* ----------------------------------------------------------------------------------------------------- */
/*  @ MyWishlist Page : <MyWishlistContainerMain /> 
/* ----------------------------------------------------------------------------------------------------- */
const MyWishListContainerMain = () => {
  return (
    <div className="container mx-auto py-6 tracking-wider">
      <div className="flex max-md:flex-col p-6 gap-6">
        <Tabs />
        <MyWishList />
      </div>
    </div>
  );
};
/* ----------------------------------------------------------------------------------------------------- */
/*  @ MyWishlist Page : <MyWishlistContainerMain /> : <MyWishlist Component />.
/* ----------------------------------------------------------------------------------------------------- */
const MyWishList = () => {
  const { principal, isConnected } = useConnect();

  const [backend] = useCanister("backend");
  const [wishlists, setWishlists] = useState("");
  const [product, getProduct] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  const wishlist = [
    {
      prodname: "Headphone xyz ",
      category: "Electronics",
      image: FakeProdImg,
      price: "$45.00",
      addedOn: formatDate(new Date()),
    },
    {
      prodname: "Headphone xyz ",
      category: "Electronics",
      image: FakeProdImg,
      price: "$45.00",
      addedOn: formatDate(new Date()),
    },
  ];
  const getWishlist = async () => {
    try {
      const item = await backend.listWishlistItems();
      const ids = item
        .filter((innerArray) => innerArray[1].principal.toText() === principal)
        .map((innerArray) => innerArray[1].id);
      setId(ids);

      const productSlugs = item
        .filter((innerArray) => innerArray[1].principal.toText() === principal)
        .map((innerArray) => innerArray[1].product_slug);

      // Set the state with all product_slugs as an array
      setWishlists(productSlugs);
      console.log(productSlugs, "hello");

      if (item.ok) {
        console.log(item);
      }
    } catch (error) {
      console.error("Error listing user:", error);
    } finally {
    }
  };

  useEffect(() => {
    getWishlist();
  }, [backend]);
  const deleteWishlist = async (id) => {
    try {
      const remove = await backend.deleteWishlistItems(id);

      if ("ok" in remove) {
        getWishlist();
        getProduct((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.success("item removed successfully");
      }
      console.log(remove);
    } catch (error) {
      console.error("deletion cannot be performed", error);
    }
  };

  const getProductWishlist = async () => {
    try {
      {
        const productPromises = wishlists.map(async (productId) => {
          const productResponse = await backend.getProduct(productId);
          return productResponse.ok; // Assuming `ok` property contains the product details
        });

        // Wait for all promises to resolve
        const products = await Promise.all(productPromises);

        getProduct(products);
        getWishlist();

        // Access and log the title property for each product
      }
    } catch (error) {
      console.error("Error while getting wishlist ", error);
    }
  };
  console.log(product);
  useEffect(() => {
    // Call getProductWishlist only when wishlists have been updated
    if (wishlists !== "") {
      const timeoutId = setTimeout(() => {
        getProductWishlist();
        setLoading(false);
      }, 5000);

      return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
    }
  }, [backend, wishlists]);

  return (
    <div className="flex flex-col w-full border border-gray-300 rounded-2xl tracking-normal">
      <h1 className="font-medium text-lg px-2 sm:px-8 py-2 flex items-center gap-2 ">
        My Wishlist({product.length})
      </h1>

      {loading ? (
        <div className="  rounded-xl mb-3   grid grid-cols-1 gap-3">
          {[...Array(2)].map((_, index) => (
            <div
              className="  md:flex justify-between border-t-[1px]   items-center gap-2"
              key={index}
            >
              <div className="flex justify-start items-start gap-2 mt-3">
                <div className="w-24  h-24 mb-2  bg-gray-100 rounded-lg ml-2 animated-pulse"></div>
                <div className="flex flex-col mt-2">
                  <h4 className="w-[75px] h-[20px] rounded-full bg-gray-100 animated-pulse mb-1"></h4>
                  <h4 className="w-[150px] h-[25px] rounded-full bg-gray-100 animated-pulse mb-2"></h4>
                  <div className="flex gap-2">
                    <h4 className="w-[60px] h-[15px] rounded-full bg-gray-100 animated-pulse"></h4>
                    <h4 className="w-[60px] h-[15px] rounded-full bg-gray-100 animated-pulse"></h4>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between xl:items-end h-full mt-12 mr-2 ml-2 mb-2">
                <div className="flex flex-row xl:justify-end items-center gap-1 mt-6">
                  <h4 className="w-[80px] h-[30px] rounded-full bg-gray-100 animated-pulse"></h4>
                  <h4 className="w-[40px] h-[20px] rounded-full bg-gray-100 animated-pulse"></h4>
                  <div className="w-[20px] h-[20px] rounded-full bg-gray-100 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!loading && product.length > 0 ? (
            <div className=" flex flex-col">
              {product.map((wishlists, index) => (
                <div
                  key={index}
                  className="border-t px-2 sm:px-8 py-4 flex max-lg:flex-col justify-between"
                >
                  <div className="flex max-md:flex-col gap-3">
                    <div>
                      <img
                        draggable="false"
                        className="h-24 w-24 object-contain bg-gray-200 rounded-2xl"
                        src={wishlists?.variantColor[0]?.img1}
                        alt={wishlists?.title}
                      />
                    </div>
                    <div className="flex flex-col lg:justify-center">
                      <p className="text-lg capitalize font-medium">
                        {wishlists?.title}
                      </p>
                      <p className="text-xs uppercase">
                        {" "}
                        Category: {wishlists?.category}
                      </p>
                      <p className="uppercase text-xs">Added On : {Date()}</p>
                    </div>
                  </div>
                  <div className="flex max-lg:ml-[108px] max-md:ml-0 gap-6">
                    <div className="flex flex-col justify-center">
                      <span className="text-[12px] uppercase">Price</span>
                      <p className="text-lg font-medium flex  items-center">
                        <IcpLogo size={16} className="mr-2" />
                        {wishlists?.variantColor[0]?.variant_price}
                      </p>
                    </div>
                    <div className="flex justify-center flex-col">
                      {/*keeping empty div for better alignment */}
                      <div className="h-4 w-4"></div>
                      <div className="flex gap-6">
                        <Button
                          className=" hover:text-red-500"
                          onClick={() => deleteWishlist(id[index][0])}
                        >
                          <BsTrash3 size={20} />
                        </Button>
                        <Button>
                          <Link to={`/product/${wishlists?.slug}`}>
                            <BsArrowRightCircle size={20} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col  items-center w-full h-full justify-center mt-2 font-bold">
              <EmptyWishlist />
              {/* <NoDataFound title={"No items in wishlist"} /> */}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default MyWishlistPage;
