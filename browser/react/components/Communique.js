import React from 'react';
import { Link } from 'react-router';
import { DataTable } from 'react-data-components';

const Communique = (props) => {
  const communiques = props.communique;
  // const buildTable = data => {
    const renderUrl =
      (val, row) =>
        (
          <a href={`${row['url']}`}>
        View on the MOFA site
        </a>
        );

    const renderFullUrl =
      (val, row) =>
        (
        <Link to={`communique/${row['id']}`}>
        View/Edit Full Communique
        </Link>
        );

    const tableColumns = [
      { title: 'Title', prop: 'title' },
      { title: 'Language', prop: 'language' },
      { title: 'Date', prop: 'date', defaultContent: '<no date>' },
      { title: 'Content', prop: 'snippet', defaultContent: '<no content>' },
      { title: 'url', render: renderUrl, className: 'text-center' },
      { title: 'View full', render: renderFullUrl, className: 'text-center' },
    ];

    return (
      <DataTable
        className="container"
        keys="id"
        columns={tableColumns}
        initialData={communiques}
        initialPageLength={20}
        initialSortBy={{ prop: 'date', order: 'ascending' }}
        pageLengthOptions={[ 20, 50, 100 ]}
      />
    );
  // }

  // return (
  //   <div>
  //     <h3>Communiques</h3>
  //   </div>
  // );
}

export default Communique;
