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
    if (token) {
      dispatch(fetchRecommendedBlogs());
      dispatch(fetchPersonalizedBlogs());
    }
  }, [dispatch, token]);

  return (
    <div>
      <>
        <div className="mb-8">
          <TrendingBlogs trendingBlogs={trendingBlogs} />
        </div>
        <>
          {token && (
            <>
              <div className="mt-8">
                <RecommendedBlogs recommendedBlogs={recommendedBlogs} />
              </div>
              <div className="mt-8">
                <PersonalizedBlogs personalizedBlogs={personalizedBlogs} />
              </div>
            </>
          )}
        </>
      </>
    </div>
  );
};

export default Home;
