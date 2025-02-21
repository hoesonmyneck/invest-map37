// Ссылка:https://investkz.gov.kz/#/main/regions/1/projects/596

// *Логин:* s.sadykov@enbek.gov.kz
// *Пароль:* Enbek123456@

const fs = import("fs");

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDQjR4ckVBb0xGYmJVVkFZU1Y5U2liUERCZy13Um4zU2hYVEVMckpFeENBIn0.eyJleHAiOjE3NDAxMjUwOTMsImlhdCI6MTc0MDEyMTQ5MywiYXV0aF90aW1lIjoxNzQwMTIxNDkyLCJqdGkiOiIzNjY1NGQ3Ni04NmU3LTRiOGUtYTI5Mi0wNGUzNjZiN2YzYjEiLCJpc3MiOiJodHRwczovL2lkLmludmVzdGt6Lmdvdi5rei9yZWFsbXMvbmNpcCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxMTA3ODM5MS03Mzg2LTQ0OWEtODRjYy1mOWFlNDA3ZjYzMDMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJnb2dhdGVrZWVwZXIiLCJzZXNzaW9uX3N0YXRlIjoiYmRjZGIzY2MtMGU4YS00ZTkzLTkyMjMtOGE1M2I3MjA1MDhmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODEvKiIsImh0dHBzOi8vaW52ZXN0a3ouZ292Lmt6LyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbmNpcCIsIm5jaXAtaW52ZXN0bWVudC1ocSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiYmRjZGIzY2MtMGU4YS00ZTkzLTkyMjMtOGE1M2I3MjA1MDhmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoibmNpcC1pbnZlc3RtZW50LWhxIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJuY2lwLWludmVzdG1lbnQtaHEiXX0sIm5hbWUiOiLQodC_0LDQsdC10Log0KHQsNC00YvSm9C-0LIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzLnNhZHlrb3ZAZW5iZWsuZ292Lmt6IiwiZ2l2ZW5fbmFtZSI6ItCh0L_QsNCx0LXQuiIsImZhbWlseV9uYW1lIjoi0KHQsNC00YvSm9C-0LIiLCJlbWFpbCI6InMuc2FkeWtvdkBlbmJlay5nb3Yua3oiLCJpc1Byb2ZpbGVDb21wbGV0ZSI6dHJ1ZSwiaWluIjoiSUlOOTMwNDE0MzAxMTgxIn0.gA7CPqCP7akKSmjUVLwol7opQd8NtSKt6EKMxmc2VnGIizXzc95Gz4ZRBJSjUSgYLz6lGIetO6c-9E_DnGjKo4TqgW3vOkmX8xfDckQp0pIYPdOD_EdnB1F6F-UYpao2vEP6ixjrXStvApBpWYvR77QR5QBWNJK9dYoeakFsIhIQqzacJS3Uu_xGfS5WOxviLt8eDlHe7aByh8QEb5gnx8_BMtRpql5hcgMBI9UGuBwiRz5kjTk27G1ag0kzWgMN_4lgiLpTUDztDXBLwR-h1ZOROOx8ut7LhvS7rY4ZAMNFpfQMnbXjrlIJDayAoqI3JO-dp83MQiGmSPGwpwx0Xw";

const url = "https://api.investkz.gov.kz/graphql";

async function getProjects() {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      variables: {
        page: 0,
        size: 2000,
      },
      query: `
      query GetAllProjects($page: Int!, $size: Int!, $search: ProjectSearchInput) {
        projects(page: $page, size: $size, search: $search) {
          content {
            id
            createdAt
            status
            initiator {
              id
              email
              firstName
              middleName
              lastName
              country {
                id
                __typename
              }
              iin
              bin
              organizationName
              phoneNumber
              __typename
            }
            projectActivity
            projectActivityDate
            projectName
            projectPriceKZT
            projectPriceUSD
            workPlacesCount
            industry {
              id
              name
              name_ru
              name_en
              name_kk
              __typename
            }
            status
            description
            investor {
              id
              email
              firstName
              middleName
              lastName
              country {
                id
                __typename
              }
              iin
              bin
              organizationName
              phoneNumber
              __typename
            }
            investorCountry {
              id
              name
              __typename
            }
            approvedAt
            rejectReason
            isInterregional
            realizationAddresses {
              region {
                id
                name
                __typename
              }
              district {
                id
                name
                __typename
              }
              address
              latitude
              longitude
              __typename
            }
            versionsCount
            temporaryWorkPlacesCount
            hasInfrastructure
            hasRawMaterials
            hasFunding
            landArea
            investorCountry {
              id
              __typename
            }
            investorCompanyName
            investorEmail
            investorOrganizationName
            investorBin
            contactDetails {
              firstName
              middleName
              lastName
              phoneNumber
              __typename
            }
            isGreenCorridor
            __typename
          }
          totalElements
          totalSumKZT
          totalSumUSD
          __typename
        }
      }
      `,
    }),
  }).then(async (response) => response.json());
}

async function getProject(projectId) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      variables: {
        id: projectId,
      },
      query: `
        query GetProject($id: Long!) {
          project(id: $id) {
            id
            comment
            createdAt
            status
            roadMap {
              id
              status
              progress {
                completedTasks
                totalTasks
                timedOutTasks
                stages {
                  stage {
                    name
                    id
                    __typename
                  }
                  completedTasks
                  totalTasks
                  __typename
                }
                __typename
              }
              approvalDetails {
                id
                reviewer {
                  id
                  firstName
                  lastName
                  __typename
                }
                reviewerRole
                rejectReason
                status
                __typename
              }
              tasks {
                id
                stage {
                  id
                  __typename
                }
                task {
                  id
                  name
                  name_ru
                  name_en
                  name_kk
                  __typename
                }
                startDate
                finishDate
                startedAt
                executedAt
                reviewerCategory
                governmentAgency {
                  id
                  name
                  name_ru
                  name_en
                  name_kk
                  __typename
                }
                responsibleEmployee {
                  id
                  firstName
                  lastName
                  __typename
                }
                status
                expired
                __typename
              }
              __typename
            }
            initiator {
              id
              email
              firstName
              middleName
              lastName
              country {
                id
                __typename
              }
              iin
              bin
              organizationName
              phoneNumber
              employee {
                governmentAgency {
                  id
                  name
                  __typename
                }
                __typename
              }
              __typename
            }
            initiatorOrganizationName
            projectActivity
            projectActivityDate
            projectName
            projectPriceKZT
            projectPriceUSD
            workPlacesCount
            industry {
              id
              name
              name_ru
              name_en
              name_kk
              __typename
            }
            okeds {
              id
              name
              name_ru
              name_en
              name_kk
              __typename
            }
            projectType
            status
            description
            investor {
              id
              email
              firstName
              middleName
              lastName
              country {
                id
                name
                __typename
              }
              iin
              bin
              organizationName
              phoneNumber
              __typename
            }
            projectStartDate
            projectExploitationDate
            specialEconomicZone {
              id
              __typename
            }
            finalProducts {
              finalProductId
              unitId
              finalProduct {
                id
                name
                __typename
              }
              unit {
                id
                name
                __typename
              }
              yearProductVolume
              __typename
            }
            attachmentsData {
              fileId
              name
              extension
              size
              __typename
            }
            foreignBorrowPercentage
            foreignFundsKZT
            foreignFundsUSD
            foreignOwnPercentage
            localBorrowPercentage
            hasBusinessPlan
            hasLandPlot
            localFundsKZT
            localFundsUSD
            localOwnPercentage
            isInterregional
            approvedAt
            rejectReason
            realizationAddresses {
              region {
                id
                name
                __typename
              }
              district {
                id
                name
                __typename
              }
              address
              latitude
              longitude
              __typename
            }
            isGreenCorridor
            tnved {
              id
              name
              code
              __typename
            }
            necessaryInvestments
            temporaryWorkPlacesCount
            versionsCount
            hasInfrastructure
            hasRawMaterials
            hasFunding
            landArea
            investorCountry {
              id
              name_en
              name_kk
              code
              name_ru
              name
              __typename
            }
            projectPoolType
            investorCompanyName
            investorEmail
            investorOrganizationName
            investorBin
            contactDetails {
              firstName
              middleName
              lastName
              phoneNumber
              __typename
            }
            __typename
          }
        }
        `,
    }),
  }).then(async (response) => response.json());
}

async function start() {
  const file = [];
  const projects = await getProjects();
  for (const project of projects.data.projects.content) {
    const projectData = await getProject(project.id);
    file.push(projectData);
  }

  (await fs).writeFile("data.json", JSON.stringify(file), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

async function main() {
  await start();
}

main();
