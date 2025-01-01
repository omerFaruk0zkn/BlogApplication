import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrendingBlogs from "../components/blogs/TrendingBlogs";
import RecommendedBlogs from "../components/blogs/RecommendedBlogs";
import PersonalizedBlogs from "../components/blogs/PersonalizedBlogs";
import {
  fetchPersonalizedBlogs,
  fetchRecommendedBlogs,
  fetchTrendingBlogs,
} from "../store/slices/blogSlice";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { trendingBlogs, recommendedBlogs, personalizedBlogs } = useSelector(
    (state) => state.blogs
  );

  useEffect(() => {
    dispatch(fetchTrendingBlogs());
    dispatch(fetchRecommendedBlogs());
    dispatch(fetchPersonalizedBlogs());
  }, [dispatch]);

  return (
    <div>
      {trendingBlogs.length > 0 ||
      (token &&
        (recommendedBlogs.length > 0 || personalizedBlogs.length > 0)) ? (
        <>
          <div className="mb-8">
            <TrendingBlogs trendingBlogs={trendingBlogs} />
          </div>
          <>
            <div className="mt-8">
              <RecommendedBlogs recommendedBlogs={recommendedBlogs} />
            </div>
            <div className="mt-8">
              <PersonalizedBlogs personalizedBlogs={personalizedBlogs} />
            </div>
          </>
        </>
      ) : (
        <p className="text-center text-red-500 font-semibold text-xl italic">
          Şu anda gösterilecek bir içerik bulunmamaktadır.
        </p>
      )}
    </div>
  );
};

export default Home;
