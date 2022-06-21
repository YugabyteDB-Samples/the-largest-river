import "./pagination.scss";
import { useEffect, useState } from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";
export default function Pagination({ pageRef, pageLength }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumbers, setPageNumbers] = useState([]);

  const page = parseInt(searchParams.get("page")) || 1;

  const setParams = (pageVal) => {
    pageRef.current = pageVal;
    if (pageVal > 1) {
      setSearchParams({ page: pageVal });
    } else {
      delete searchParams.page;
      setSearchParams({ ...searchParams });
    }
  };
  const handleClickNext = (e) => {
    e.preventDefault();
    const pageVal = page + 1;
    setParams(pageVal);
  };

  const handleClickPrevious = (e) => {
    e.preventDefault();
    const pageVal = page > 1 ? page - 1 : page;
    setParams(pageVal);
  };

  const handleClickPage = (e) => {
    e.preventDefault();
    const pageVal = parseInt(e.target.getAttribute("page-num"));
    setParams(pageVal);
  };

  const handleClickFirst = (e) => {
    e.preventDefault();
    const pageVal = 1;
    setParams(pageVal);
  };
  const handleClickLast = (e) => {
    e.preventDefault();
    const pageVal = pageLength;
    setParams(pageVal);
  };

  const BootstrapPaginationNumbers = pageNumbers.map((pageNum) => {
    return (
      <BootstrapPagination.Item
        key={uuidv4()}
        page-num={pageNum}
        onClick={handleClickPage}
        active={page === pageNum}
      >
        {pageNum}
      </BootstrapPagination.Item>
    );
  });

  useEffect(() => {
    const internalPageNumbers = [];
    let startingNum;
    if (page % 5 === 0) {
      startingNum = page - 4;
    } else {
      startingNum = Math.max(page - (page % 5) + 1, 1);
    }

    for (
      let i = startingNum;
      i <
      Math.min(startingNum + 5, startingNum + (pageLength - startingNum + 1));
      i++
    ) {
      internalPageNumbers.push(i);
    }

    if (
      pageNumbers.length === 0 ||
      page > pageNumbers[pageNumbers.length - 1] ||
      page < pageNumbers[0]
    ) {
      setPageNumbers(internalPageNumbers);
    }
  }, [page, pageLength]);
  return (
    <BootstrapPagination>
      <BootstrapPagination.First
        disabled={page === 1 || pageLength === 0}
        onClick={handleClickFirst}
      />
      <BootstrapPagination.Prev
        disabled={page === 1 || pageLength === 0}
        onClick={handleClickPrevious}
      />
      {BootstrapPaginationNumbers}
      <BootstrapPagination.Next
        disabled={page === pageLength || pageLength === 0}
        onClick={handleClickNext}
      />
      <BootstrapPagination.Last
        disabled={page === pageLength}
        onClick={handleClickLast}
      />
    </BootstrapPagination>
  );
}
