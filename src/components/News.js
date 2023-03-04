import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props?.country}&category=${props?.category}&apiKey=${props?.apiKey}&page=${page}&pageSize=${props?.pageSize}`;
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData?.articles);
        setTotalResults(parsedData?.totalResults);
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props?.category)} - NewsMonkey`;
        updateNews();
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        setPage(page + 1);
        const url = `https://newsapi.org/v2/top-headlines?country=${props?.country}&category=${props?.category}&apiKey=${props?.apiKey}&page=${page + 1}&pageSize=${props?.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData?.articles));
        setTotalResults(parsedData?.totalResults);
    };

    return (
        <>
            <h1 className='text-center mb-3 mt-9'>News - Top {capitalizeFirstLetter(props?.category)} Headlines</h1>

            <InfiniteScroll dataLength={articles?.length} next={fetchMoreData} hasMore={articles?.length !== totalResults} loader={<h4>Loading...</h4>}>

                <div className='container'>
                    <div className="row">

                        {articles.map((el, index) => {
                            return <div className="col-md-4" key={index}>
                                <NewsItem description={el?.description ? el?.description.slice(0, 50) : ''} title={el?.title ? el?.title.slice(0, 20) : ''} imageUrl={el?.urlToImage} newsUrl={el?.url} author={el?.author} date={el?.publishedAt} />
                            </div>
                        })}

                    </div>
                </div>

            </InfiniteScroll>

        </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 10,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News
