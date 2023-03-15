import React from 'react';
import Link from './Link';
import { useQuery, gql } from '@apollo/client';

// 客户端的query操作例子
// const FEED_QUERY = gql`
//   {
//     feed {
//       id
//       links {
//         id
//         createdAt
//         url
//         description
//       }
//     }
//   }
// `;

export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

console.log('FEED_QUERY', FEED_QUERY)

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

// const LinkList = () => {
//     const linksToRender = [
//         {
//             id: 'link-id-1',
//             description:
//                 'Prisma gives you a powerful database toolkit 😎',
//             url: 'https://prisma.io'
//         },
//         {
//             id: 'link-id-2',
//             description: 'The best GraphQL client',
//             url: 'https://www.apollographql.com/docs/react/'
//         }
//     ];
//
//     return (
//         <div>
//             {linksToRender.map((link) => (
//                 <Link key={link.id} link={link} />
//             ))}
//         </div>
//     );
// };

// http
// const LinkList = () => {
//     // 这里使用的useQuery hook来加载数据，放弃像上一次的例子那样使用fetch或者axois了
//     const { data, loading, error } = useQuery(FEED_QUERY);
//
//     return (
//         <div>
//             {data && (
//                 <>
//                     {data.feed.links.map((link, index) => (
//                         <Link key={link.id} link={link} index={index} />
//                     ))}
//                 </>
//             )}
//         </div>
//     );
// };

// websocket
const LinkList = () => {
    const {
        data,
        loading,
        error,
        subscribeToMore
    } = useQuery(FEED_QUERY);

    // ...

    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newLink = subscriptionData.data.newLink;
            const exists = prev.feed.links.find(
                ({ id }) => id === newLink.id
            );
            if (exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            });
        }
    });

    subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION
    });
    return (
        <div>
            {data && (
                <>
                    {data.feed.links.map((link, index) => (
                        <Link key={link.id} link={link} index={index} />
                    ))}
                </>
            )}
        </div>
    );
};

export default LinkList;