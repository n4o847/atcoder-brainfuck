import { useState } from 'react';
import { Badge, Pagination, Table } from 'react-bootstrap';
import { useContests, useProblems, useRecentSubmissions } from '../api';
import NewTabLink from '../components/NewTabLink';
import { formatDateTime, parseSecond } from '../utils/date';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_v, k) => k + start);

const pageList = (
  currPage: number,
  pageStartIndex: number,
  totalPage: number
): number[] => {
  if (totalPage === 0) {
    return [];
  }
  if (totalPage <= 10) {
    return range(1, totalPage);
  }

  const pageNumbers: number[] = [currPage];
  let tmpExp = 1;
  for (;;) {
    tmpExp *= 2;
    const tmpPageNumber = currPage - tmpExp + 1;
    if (tmpPageNumber < pageStartIndex) {
      break;
    }
    pageNumbers.unshift(tmpPageNumber);
  }
  if (pageNumbers[0] !== pageStartIndex) {
    pageNumbers.unshift(pageStartIndex);
  }

  tmpExp = 1;
  for (;;) {
    tmpExp *= 2;
    const tmpPageNumber = currPage + tmpExp - 1;
    if (tmpPageNumber > totalPage) {
      break;
    }
    pageNumbers.push(tmpPageNumber);
  }
  if (pageNumbers.slice(-1)[0] !== totalPage) {
    pageNumbers.push(totalPage);
  }

  return pageNumbers;
};

function Submissions() {
  const recentSubmissions = useRecentSubmissions();
  const contests = useContests();
  const problems = useProblems();
  const [currPage, setCurrPage] = useState(1);

  const contestTitleMap = contests.reduce((map, c) => {
    map.set(c.id, c.title);
    return map;
  }, new Map<string, string>());

  const problemTitleMap = problems.reduce((map, p) => {
    map.set(p.id, p.title);
    return map;
  }, new Map<string, string>());

  const ITEMS_PER_PAGE = 20;

  const pageNumbers = pageList(
    currPage,
    1,
    Math.ceil(recentSubmissions.length / ITEMS_PER_PAGE)
  );

  return (
    <>
      <h1>Recent Submissions</h1>
      <Pagination>
        {pageNumbers.map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === currPage}
            onClick={() => setCurrPage(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
      </Pagination>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Problem</th>
            <th>User</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recentSubmissions
            .slice((currPage - 1) * ITEMS_PER_PAGE, currPage * ITEMS_PER_PAGE)
            .map((submission) => (
              <tr key={submission.id}>
                <td>{formatDateTime(parseSecond(submission.epoch_second))}</td>
                <td>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {contestTitleMap.get(submission.contest_id)}
                  </span>
                  <br />
                  <NewTabLink
                    href={`https://atcoder.jp/contests/${submission.contest_id}/tasks/${submission.problem_id}`}
                  >
                    {problemTitleMap.get(submission.problem_id)}
                  </NewTabLink>
                </td>
                <td>
                  <NewTabLink
                    href={`https://atcoder.jp/users/${submission.user_id}`}
                  >
                    {submission.user_id}
                  </NewTabLink>
                </td>
                <td align="center">
                  <Badge
                    {...(submission.result === 'AC'
                      ? { bg: 'success' }
                      : { bg: 'warning', text: 'dark' })}
                  >
                    {submission.result}
                  </Badge>
                </td>
                <td>
                  <NewTabLink
                    href={`https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`}
                  >
                    Detail
                  </NewTabLink>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}

export default Submissions;
