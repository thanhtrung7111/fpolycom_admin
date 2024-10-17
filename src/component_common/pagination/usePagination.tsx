import { useMemo } from "react";
export const DOTS: number = 0;
export const usePanigation = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}) => {
  const range = (start: number, end: number): number[] => {
    let length = end - start + 1;

    return Array.from({ length }, (_, idx) => idx + start);
  };
  const panigationRange: number[] | undefined = useMemo(() => {
    const totalPageCount: number = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers: number = siblingCount + 5;
    console.log(totalPageCount);
    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex: number = Math.max(currentPage - siblingCount, 1);
    console.log(currentPage - siblingCount);
    const rightSiblingIndex: number = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots: boolean = leftSiblingIndex >= 3;
    const shouldShowRightDots: boolean = rightSiblingIndex < totalPageCount - 3;

    const firstPageIndex: number = 1;
    const lastPageIndex: number = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount: number = 3 + 2 * siblingCount;
      let leftRange: number[] = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount: number = 3 + 2 * siblingCount;
      let rightRange: number[] = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange: number[] = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    let middleRange: number[] = range(leftSiblingIndex, rightSiblingIndex);

    console.log([firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]);
    // return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);
  return panigationRange;
};
