import React, { useEffect } from "react";
import { Screen } from "app/components";
import { colors, spacing } from "app/theme";
import { View } from "react-native";
import { AppStackScreenProps } from "app/navigators";

interface ConsumerTermsScreenProps
  extends AppStackScreenProps<"ConsumerTermsAndConditions"> {}

export const ConsumerTermsScreen = ({
  navigation,
  route,
}: ConsumerTermsScreenProps) => {
  useEffect(() => {
    if (route.params?.mobile) {
      navigation.setOptions({ header: () => null });
    }
  }, [route.params?.mobile]);

  return (
    <Screen preset="scroll" backgroundColor={colors.palette.neutral200}>
      <View
        style={{
          backgroundColor: colors.background,
          padding: route.params?.mobile ? spacing.md : spacing.lg,
          flex: 1,
          paddingBottom: 50,
        }}
      >
        <p
          dir="ltr"
          style={{
            lineHeight: "1.2",
            marginRight: "3.1pt",
            textAlign: "center",
            marginTop: "4pt",
            marginBottom: "0pt",
          }}
        >
          <span
            style={{
              fontSize: "12pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            General Terms
          </span>
        </p>
        <p
          dir="ltr"
          style={{
            lineHeight: "1.2",
            marginLeft: "0.3pt",
            marginRight: "3.1pt",
            textAlign: "center",
            marginTop: "2.7pt",
            marginBottom: "0pt",
          }}
        >
          <span
            style={{
              fontSize: "12pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            to DelivFree Food Delivery Service with the Customer
          </span>
        </p>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <p
          dir="ltr"
          style={{
            lineHeight: "1.4000000000000001",
            marginLeft: "10pt",
            marginRight: "11.9pt",
            textAlign: "justify",
            marginTop: "0pt",
            marginBottom: "0pt",
          }}
        >
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            These General Terms shall apply to all relations between DelivFree
            and the User related to the use of the DelivFree Food Platform (as
            defined below). By signing up in the DelivFree Food Platform, the
            User agrees to the application and content of these General Terms
            and to the processing of his/her personal data disclosed during
            registration and use of the DelivFree Food Platform on the
            conditions set out in these General Terms. You also agree that your
            data may be shared between different DelivFree platforms.
          </span>
        </p>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DEFINITIONS
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <div dir="ltr" style={{ marginLeft: "49.1pt" }}>
          <table style={{ border: "none", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      DelivFree
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.3900000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.5pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means DelivFree Operations, Head Office address 422
                      Richards Street Suite#170 Vancouver B.C. Canada V6B2Z4
                      e-mail address&nbsp;
                    </span>
                    <a
                      href="mailto:support@delivfree.com"
                      style={{ textDecoration: "none" }}
                    >
                      <span
                        style={{
                          fontSize: "10pt",
                          fontFamily: "Arial,sans-serif",
                          color: "#000000",
                          backgroundColor: "transparent",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontVariant: "normal",
                          textDecoration: "none",
                          verticalAlign: "baseline",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        support@delivfree.com
                      </span>
                    </a>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "179.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginRight: "25.8pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      DelivFree Food Platform
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.2pt",
                      textAlign: "justify",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the food delivery platform operated by DelivFree as
                      the information service provider which functions as the
                      Marketplace that (i) enables Restaurant Operators to
                      market Meals with delivery option for the sale of Meals to
                      Customers, (ii) enables the Users to place Orders of Meals
                      with the Restaurant Operator, via DelivFree App or
                      Website,(iii) enables Customers to pay Restaurants for
                      Meals they Ordered via the DelivFree App or Website, and
                      arrange the delivery of the Meal by the Independent
                      Contractor Driver and (iv.) enables the Independent
                      Contractor Driver to offer delivery services to Customers
                      for the delivery of the Meals and enter into Delivery
                      Agreements with Restaurants (v.) and enables Independent
                      Delivery Drivers to enter into Delivery Service Agreements
                      with Restaurants as an Authorized DelivFree Independent
                    </span>
                  </p>
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.1099999999999999",
                      marginLeft: "5.2pt",
                      textAlign: "justify",
                      marginTop: "0pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Contractor Driver.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Customer
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.75pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means any User of the DelivFree Food Platform that has
                      placed an Order and enters into a Sales Agreement with the
                      Restaurant Operator and a Delivery Agreement with the
                      Independent Contractor Driver.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "56.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginRight: "16.75pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Independent Contractor Driver
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.55pt",
                      textAlign: "justify",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means any person who has been registered in the DelivFree
                      Food Platform as a provider of the delivery service to
                      Customers with respect to Meals ordered through the
                      DelivFree Food Platform.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "66.8pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginRight: "15.25pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Independent Contractor Driver Fee
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.4pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the fee for the delivery services related to an
                      Order, that the Restaurant pays to the Independent
                      Contractor Driver under the Delivery Agreement. The
                      Independent Contractor Driver Fee is calculated in
                      accordance with the principles set out in Section 7.
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <br />
        </p>
        <p>
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            <br />
          </span>
        </p>
        <div dir="ltr" style={{ marginLeft: "49.1pt" }}>
          <table style={{ border: "none", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.1pt",
                      marginRight: "25.8pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Delivery Agreement
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.45pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the agreement between the Customer and the
                      Independent Contractor Driver for the delivery of the Meal
                      ordered by the Customer concluded through the DelivFree
                      Food Platform.
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <br />
        </p>
        <div dir="ltr" style={{ marginLeft: "49.1pt" }}>
          <table style={{ border: "none", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ height: "44.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Drop-Off Location
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.55pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the address indicated in the Order, where the
                      Customer wishes to receive the ordered Meal.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      General Terms
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.6pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means these terms and conditions applicable to the
                      relationship between DelivFree and the Customer in
                      relation to the use of the DelivFree Food Platform by the
                      Customer.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "99.5pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Marketplace
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.45pt",
                      textAlign: "justify",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the virtual marketplace created through the
                      DelivFree Food Platform and operated by DelivFree that
                      enables the participating Restaurant Operators to market
                      their Meals to Users so that the Users can order the Meal
                      and enter into the Sales Agreement with the Restaurant
                      Operator as Customers for purchasing the Meal and utilise
                      the on-demand delivery services offered at the Marketplace
                      by the
                    </span>
                  </p>
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.1300000000000001",
                      marginLeft: "5.2pt",
                      textAlign: "justify",
                      marginTop: "0pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Independent Contractor Drivers.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "56.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Meal
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.35pt",
                      textAlign: "justify",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means any ready-made meal and/or other food product or
                      beverage that the Restaurant Operator offers for sale
                      through the DelivFree Food Platform.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Meal Price
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.7pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the net price (together with applicable value added,
                      sales or other taxes where applicable) that the Customer
                      has to pay to the Restaurant Operator for the ordered
                      Meal.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "56.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.1pt",
                      marginRight: "5.35pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Minimum
                    </span>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <span
                        className="Apple-tab-span"
                        style={{ whiteSpace: "pre" }}
                      >
                        &nbsp; &nbsp;&nbsp;
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Order Value
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.6pt",
                      textAlign: "justify",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the amount determined by the DelivFree Food Platform
                      which indicates the minimum Meal Price of a meal for which
                      an Order can be placed through the DelivFree Food
                      Platform.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.1pt",
                      marginRight: "5.35pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Minimum
                    </span>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <span
                        className="Apple-tab-span"
                        style={{ whiteSpace: "pre" }}
                      >
                        &nbsp; &nbsp;&nbsp;
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Value Compensation
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.6pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the fee payable by Customer to DelivFree in
                      accordance with Section 3.2 in order to compensate the
                      difference between the Minimum Order Value and the Meal
                      Price of a particular Order..
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "44.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Order
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.55pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the order of a Meal that the Customer has placed
                      with the Restaurant Operator.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "45pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Order Price
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.55pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the price that the User has to pay for the
                      purchase(d) Meal(s) and delivery of the Order.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "45.05pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Restaurant
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.55pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means each and every establishment through which the
                      Restaurant Operator conducts its business on the DelivFree
                      Food Platform.
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <br />
        </p>
        <p>
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            <br />
          </span>
        </p>
        <div dir="ltr" style={{ marginLeft: "49.1pt" }}>
          <table style={{ border: "none", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ height: "70.5pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.1pt",
                      marginRight: "25.8pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Restaurant Operator
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.4pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the operator of any Restaurant, café, bistro, food
                      kiosk, canteen, delivery-only-kitchen, gastronomy
                      department in a grocery store or other Meal production
                      establishment that provides its services on the DelivFree
                      Food Platform.
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <br />
        </p>
        <div dir="ltr" style={{ marginLeft: "49.1pt" }}>
          <table style={{ border: "none", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ height: "44.95pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                      marginRight: "25.8pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Sales Agreement
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "7.9pt",
                      marginTop: "5.6pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means the agreement between the Customer and the
                      Restaurant for the sale of Meals in accordance with the
                      Order.
                    </span>
                  </p>
                </td>
              </tr>
              <tr style={{ height: "57pt" }}>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.2",
                      marginLeft: "5.1pt",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      User
                    </span>
                  </p>
                </td>
                <td
                  style={{
                    borderLeft: "solid #bdbdbd 0.75pt",
                    borderRight: "solid #bdbdbd 0.75pt",
                    borderBottom: "solid #bdbdbd 0.75pt",
                    borderTop: "solid #bdbdbd 0.75pt",
                    verticalAlign: "top",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                  }}
                >
                  <p
                    dir="ltr"
                    style={{
                      lineHeight: "1.4000000000000001",
                      marginLeft: "5.2pt",
                      marginRight: "4.85pt",
                      textAlign: "justify",
                      marginTop: "5.65pt",
                      marginBottom: "0pt",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10pt",
                        fontFamily: "Arial,sans-serif",
                        color: "#000000",
                        backgroundColor: "transparent",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontVariant: "normal",
                        textDecoration: "none",
                        verticalAlign: "baseline",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      means any person that has registered a user account on the
                      DelivFree Food Platform and uses the services of the
                      DelivFree Food Platform through that user account.
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={2}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0.05pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                LEGAL FRAMEWORK
              </span>
            </p>
          </li>
        </ol>
        <br />
        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.3900000000000001",
                marginRight: "12.2pt",
                textAlign: "justify",
                marginTop: "0.05pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The DelivFree Food Platform enables the Customer to order Meals
                from Restaurant Operators and arrange the delivery of the Orders
                to the Drop-Off Location.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.2pt",
                textAlign: "justify",
                marginTop: "10.7pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                For the sale of Meals through the DelivFree Food Platform a
                Sales Agreement is concluded directly between the Customer and
                the Restaurant Operator. For the delivery of the Order, the
                Customer enters into a Delivery Agreement directly with the
                Independent Contractor Driver. The Delivery Agreement is deemed
                to be concluded from the moment that the Order is confirmed on
                the DelivFree Food Platform.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.9pt",
                textAlign: "justify",
                marginTop: "10.6pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                By operating the DelivFree Food Platform and the Marketplace,
                DelivFree acts only as a provider of the information service and
                is neither a party to the Sales Agreement between the Customer
                and the Restaurant or the Delivery Agreement. DelivFree is not
                the manufacturer or seller of the Meals or provider of the
                delivery services and is not liable in any way for the
                performance of the Sales Agreement or the Delivery Agreement.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.85pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                By operating the DelivFree Food Platform, DelivFree acts as the
                agent for the Restaurant Operators in relation to mediation of
                Sales Agreements between the Restaurant Operators and the
                Customers. DelivFree also acts as the agent for the Independent
                Contractor Drivers in relation to mediation of Independent
                Contractor Driver Agreements between the Independent Contractor
                Drivers and the Customers. As the agent DelivFree has been
                authorised by each Restaurant Operator to receive payments and
                each Independent Contractor Driver to receive gratuities from
                the Customers on behalf of the respective principal and allocate
                the received funds between the Restaurant Operators and the
                Independent Contractor Drivers.
              </span>
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                <br />
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={3}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "4pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                ORDERING MEALS THROUGH DELIVFREE FOOD PLATFORM
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <p
          dir="ltr"
          style={{
            lineHeight: "1.2",
            marginLeft: "5pt",
            marginRight: "5.2pt",
            marginTop: "0pt",
            marginBottom: "0pt",
          }}
        >
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            The Customer can select and order Meals through the DelivFree Food
            Platform. In the event that the Restaurant Operator cannot provide
            the Meal as requested in the Order, the Restaurant will not confirm
            the Order in the DelivFree Food Platform. The Restaurant Operator
            may contact the Customer in order to agree on changes to the Order,
            so that the initial Meal Price would remain the same. If no
            agreement is reached or if the Customer would have to pay more or
            less for the replacement Meal than the ordered Meal, the Order will
            be cancelled and the Customer will not be charged for the Order or
            (where applicable)the Order Price will be returned to the Customer
            in full.
          </span>
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            <br />
          </span>
        </p>
        <br />
        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.4pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Customer has a right to receive Meals which comply with
                their description set out in the DelivFree Food Platform and any
                specific requirements (if agreed upon). In case of doubt
                regarding any allergies that the Customer may have to any Meals,
                the Customer is to contact the Restaurant Operator for further
                information.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.85pt",
                textAlign: "justify",
                marginTop: "10.6pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                If the Minimum Order Value applies and the Meal Price related to
                an Order is below that Minimum Order Value the Customer can
                place an Order and it will be confirmed by DelivFree on the
                condition that the Customer compensates the difference between
                the Minimum Order Value and the Meal Price for that Order in the
                form of the Minimum Value Compensation payable to DelivFree.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.8pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                During the creation of a User account enabling access to the
                DelivFree Food Platform, the User’s mobile number is linked to
                the respective DelivFree User account and added to DelivFree’s
                database. If the User is no longer using the mobile number,
                he/she must notify DelivFree within 7 days so that the User’s
                account data could be anonymized. If the User does not notify
                DelivFree about any change to his/her number, the mobile
                operator might pass the same mobile number to a next person and
                when using the DelivFree Food Platform, this new person can see
                the User’s data.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={4}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0.05pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                ORDERING DELIVERY THROUGH DELIVFREE FOOD PLATFORM
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                Upon placement of the Order the Customer has to arrange the
                delivery service by the Independent Contractor Driver through
                the DelivFree Food Platform in order to procure delivery of the
                Meal to the requested Drop-Off Location (i.e. there is no
                self-pick up option). The Customer will enter into the Delivery
                Agreement with the Independent Contractor Driver through the
                DelivFree Food Platform.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.9pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Independent Contractor Driver will deliver the Order to the
                Drop-Off Location indicated by the Customer through the
                DelivFree Food Platform. The Customer and the Independent
                Contractor Driver may agree on a different Drop-Off Location,
                provided that the new address is close to the original Drop-Off
                Location (not more than one block away).
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.9pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Customer must be present at the Drop-Off Location at least
                at the estimated time of delivery of the Order indicated on the
                DelivFree Food Platform. The Customer must be available to
                receive calls at the phone number submitted through the
                DelivFree Food Platform from the moment of submitting the Order
                on the DelivFree Food Platform until receiving the Order from
                the Independent Contractor Driver.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.5pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree may cancel the delivery and charge the Customer for
                the full price of the Order in the following cases:
              </span>
            </p>
            <ol
              style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
            >
              <li
                dir="ltr"
                style={{
                  listStyleType: "decimal",
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre",
                  marginLeft: "20.950000000000003pt",
                  paddingLeft: "25.049999999999997pt",
                }}
                aria-level={3}
              >
                <p
                  dir="ltr"
                  style={{
                    lineHeight: "1.4000000000000001",
                    marginRight: "11.95pt",
                    textAlign: "justify",
                    marginTop: "10.55pt",
                    marginBottom: "0pt",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial,sans-serif",
                      color: "#000000",
                      backgroundColor: "transparent",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontVariant: "normal",
                      textDecoration: "none",
                      verticalAlign: "baseline",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    the Customer is not available at the Drop-Off Location
                    within 5 minutes of the arrival of the Independent
                    Contractor Driver thereto;
                  </span>
                  <span
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial,sans-serif",
                      color: "#000000",
                      backgroundColor: "transparent",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontVariant: "normal",
                      textDecoration: "none",
                      verticalAlign: "baseline",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <br />
                  </span>
                </p>
              </li>
              <li
                dir="ltr"
                style={{
                  listStyleType: "decimal",
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre",
                  marginLeft: "20.950000000000003pt",
                  paddingLeft: "25.049999999999997pt",
                }}
                aria-level={3}
              >
                <p
                  dir="ltr"
                  style={{
                    lineHeight: "1.4000000000000001",
                    marginRight: "12.3pt",
                    textAlign: "justify",
                    marginTop: "3.35pt",
                    marginBottom: "0pt",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial,sans-serif",
                      color: "#000000",
                      backgroundColor: "transparent",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontVariant: "normal",
                      textDecoration: "none",
                      verticalAlign: "baseline",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    the phone number provided by the Customer cannot be reached
                    by the Independent Contractor Driver within 5 minutes; or
                  </span>
                </p>
              </li>
              <li
                dir="ltr"
                style={{
                  listStyleType: "decimal",
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre",
                  marginLeft: "20.950000000000003pt",
                  paddingLeft: "25.049999999999997pt",
                }}
                aria-level={3}
              >
                <p
                  dir="ltr"
                  style={{
                    lineHeight: "1.4000000000000001",
                    marginRight: "12.45pt",
                    textAlign: "justify",
                    marginTop: "10.5pt",
                    marginBottom: "0pt",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial,sans-serif",
                      color: "#000000",
                      backgroundColor: "transparent",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontVariant: "normal",
                      textDecoration: "none",
                      verticalAlign: "baseline",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    the Customer and the Independent Contractor Driver fail to
                    agree on a new Drop- Off Location according to Section 4.2
                    above.
                  </span>
                </p>
              </li>
            </ol>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.4pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                Any delivery time or other time estimate communicated to the
                Customer by the Independent Contractor Driver or DelivFree
                through the DelivFree Food Platform are only estimated times.
                There is no guarantee that the Meal will be delivered at the
                estimated time. Delivery times of the Orders may also be
                affected by factors such as traffic jams, rush hours and weather
                conditions.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={5}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                COMPLAINTS
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.8pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                If the Customer has any complaints regarding the ordered Meals
                the Customer must contact the restaurant directly or If the
                Customer has any complaints regarding the delivery of the Order,
                the Customer is encouraged to inform DelivFree thereof through
                the DelivFree Food Platform as soon as possible, but no later
                than within one month of the delivery of the specific Order.
                DelivFree may request a photograph of the Meal or other evidence
                or explanation of the circumstances related to the driver or
                restaurant complaint.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.2pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree will direct Restaurant to provide a refund in respect
                of the affected Meal or part of the Meal or the delivery if
                DelivFree has reasonable cause to believe that the complaint is
                justified.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={6}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                PAYMENTS AND INVOICING
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.85pt",
                textAlign: "justify",
                marginTop: "0.05pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Customer has to pay the Meal Price to the Restaurant
                Operator in the amount indicated on the DelivFree Food Platform.
                Meal Prices in the DelivFree Food Platform WILL NOT differ from
                the Meal Prices in the Restaurant. The Meal Prices on the
                DelivFree Food Platform may be changed from time to time before
                making an Order.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.8pt",
                textAlign: "justify",
                marginTop: "10.6pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree, acting as an agent of the Restaurant and the
                Independent Contractor Driver shall prepare and issue to the
                Customer the invoices or receipts for the Meal Price and the
                Independent Contractor Driver Gratuity on behalf of the
                Restaurant Operator and the Independent Contractor Driver
                respectively, and accept the Customer’s payment for the invoices
                on behalf of the Restaurant Operator and the Independent
                Contractor Driver. DelivFree is authorized to collect the Meal
                Price and the Independent Contractor Driver Gratuity from the
                Customer on behalf of the Restaurant Operator and the
                Independent Contractor Driver respectively and distribute the
                sums accordingly to the respective principal.
              </span>
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                <br />
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.8pt",
                textAlign: "justify",
                marginTop: "3.35pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                All payments are processed from Customer’s payment card or other
                payment methods activated by the Customer on the DelivFree Food
                Platform. Payments are processed through a third-party payment
                processor. Upon confirming the Order the Customer authorises the
                payment with its payment card or using other eligible payment
                method in the amount of the Order Price, and the respective
                amount will be reserved on the payment card or through other
                means of payment. The payment related to the Order will be
                performed and charged from the Customer’s payment card or using
                other payment methods within 72h from confirmation of the Order.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The payment obligations of the Customer arising from the Sales
                Agreement and the Gratuity are deemed to be fulfilled
                respectively towards the Restaurant Operator and the Independent
                Contractor Driver when payment has been performed to DelivFree
                and charged from the Customer’s credit card. If the Order Price
                cannot be reserved on the Customer’s credit card, the Order will
                not be forwarded to the Restaurant.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree, at its sole discretion, can make promotional offers
                and discounts regarding the Meal Price.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.25pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree has the right to establish a Minimum Order Value that
                applies to Orders, for which the Meal Price is less than the
                Minimum Order Value and charge the Customer for Minimum Value
                Compensation in accordance with Section 3.3.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={7}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                CANCELLATION AND SUSPENSION OF USE
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.3900000000000001",
                marginRight: "12.7pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Customer may not withdraw from or cancel an Order after
                having made the payment order for paying the respective Order
                Price.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.05pt",
                textAlign: "justify",
                marginTop: "10.7pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree is entitled to remove a Customer from the DelivFree
                Food Platform with immediate effect and/or refuse or cancel any
                Orders, if the Customer causes any abuse or harm to the
                DelivFree Food Platform, if DelivFree has reasonable belief of
                fraudulent acts by the Customer when using the DelivFree Food
                Platform, or if the Customer otherwise fails to comply with
                his/her obligations under these General Terms (e.g. by not being
                present at the Drop-Off Location on several occasions, as per
                Section 4.4).
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.95pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Customer may not use the DelivFree Food Platform for money
                laundering purposes. If the Customer violates this Section 7.3,
                DelivFree may permanently suspend the Customer from using the
                DelivFree Food Platform.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={8}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                LICENCING, INTELLECTUAL PROPERTY RIGHTS AND DATA PROCESSING
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.95pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                By registering on the DelivFree Food Platform, DelivFree grants
                the User a revocable, non- exclusive, non-transferable,
                non-sublicencable license to use the DelivFree Food Platform for
                the purpose of ordering Meals and arranging the delivery of the
                Orders.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.25pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                All intellectual property rights regarding the software,
                documentation or information used or developed by or on behalf
                of DelivFree during the provision of the information society
              </span>
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                <br />
              </span>
            </p>
          </li>
        </ol>
        <p
          dir="ltr"
          style={{
            lineHeight: "1.4000000000000001",
            marginLeft: "82pt",
            marginRight: "11.8pt",
            textAlign: "justify",
            marginTop: "3.35pt",
            marginBottom: "0pt",
          }}
        >
          <span
            style={{
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre-wrap",
            }}
          >
            services under these General Terms (incl. the DelivFree Food
            Platform and any material uploaded therein) belong to DelivFree (or,
            sometimes, to a limited extent, the Restaurant Operator). The User
            shall not copy, modify, adapt, reverse-engineer, decompile or
            otherwise discover the source code of the DelivFree Food Platform or
            any other software used by DelivFree or extract or use any data on
            the DelivFree Food Platform for commercial purposes or any other
            purpose than ordering Meals. The User shall use the DelivFree Food
            Platform solely for his/her personal, non-commercial purposes.
          </span>
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={3}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.6pt",
                textAlign: "justify",
                marginTop: "10.6pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The principles for processing the Users’ and Customers’ personal
                data is set out in the Privacy Policy available on the DelivFree
                Food Platform.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.1pt",
                textAlign: "justify",
                marginTop: "10.45pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree is not providing any warranties, guarantees or
                representations regarding the quality of the DelivFree Food
                Platform, including regarding the absence of apparent or hidden
                defects, fitness for ordinary or particular (special) purpose,
                and DelivFree is not required to satisfy the User’s claims
                regarding the quality of the DelivFree Food Platform.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={9}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "1.6500000000000021pt",
              paddingLeft: "8.3pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                LIABILITY
              </span>
            </h1>
          </li>
        </ol>

        <br />

        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.15pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Restaurant Operator is solely liable for any defects in the
                quality and quantity of the ordered Meals or other shortcomings
                in the performance of the Sales Agreement and DelivFree does not
                assume any liability thereof (including liability for any
                allergic reactions to Meals or any other health issues).
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.4pt",
                textAlign: "justify",
                marginTop: "10.6pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The Independent Contractor Drivers are solely responsible for
                the performance of the Delivery Agreement and DelivFree does not
                assume any liability thereof.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "11.85pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                If a User suspects that his/her credit card associated with
                their DelivFree Food Platform has been stolen and/or is being
                fraudulently used by a third party, the User has to inform
                DelivFree thereof immediately. Until receiving such
                notification, DelivFree will not be liable for any fraudulent
                use of the User’s credit card by third parties on the User’s
                account.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "29.299999999999997pt",
              paddingLeft: "16.700000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.25pt",
                textAlign: "justify",
                marginTop: "10.5pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The DelivFree Food Platform is provided to the User strictly on
                an "as is" basis. DelivFree will not be liable for any
                interruptions, connection errors, unavailability of, or faults
                in the DelivFree Food Platform.
              </span>
            </p>
          </li>
        </ol>
        <p>
          <br />
        </p>
        <p>
          <br />
        </p>
        <ol
          style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}
          start={10}
        >
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "-3.8999999999999986pt",
              paddingLeft: "13.850000000000001pt",
            }}
            aria-level={1}
          >
            <h1
              dir="ltr"
              style={{
                lineHeight: "1.2",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                MISCELLANEOUS
              </span>
            </h1>
          </li>
        </ol>
        <br />
        <ol style={{ marginTop: 0, marginBottom: 0, paddingInlineStart: 48 }}>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "23.799999999999997pt",
              paddingLeft: "22.200000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.4pt",
                textAlign: "justify",
                marginTop: "0pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree reserves the right to make changes to the General
                Terms at any time, by uploading the revised General Terms onto
                the DelivFree Food Platform and notifying all Users thereof.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "23.799999999999997pt",
              paddingLeft: "22.200000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.25pt",
                textAlign: "justify",
                marginTop: "10.45pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                DelivFree may change or remove different parts of the DelivFree
                Food Platform or change the DelivFree Food Platform, its
                features and the selection of Restaurant Operators participating
                in the DelivFree Food Platform in part or in whole at any time
                without prior notice.
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "23.799999999999997pt",
              paddingLeft: "22.200000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.4pt",
                textAlign: "justify",
                marginTop: "10.55pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                The use of the DelivFree Food Platform and all legal relations
                formed thereunder will be governed by the substantive law of
                Canada.
              </span>
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                <br />
              </span>
            </p>
          </li>
          <li
            dir="ltr"
            style={{
              listStyleType: "decimal",
              fontSize: "10pt",
              fontFamily: "Arial,sans-serif",
              color: "#000000",
              backgroundColor: "transparent",
              fontWeight: 700,
              fontStyle: "normal",
              fontVariant: "normal",
              textDecoration: "none",
              verticalAlign: "baseline",
              whiteSpace: "pre",
              marginLeft: "23.799999999999997pt",
              paddingLeft: "22.200000000000003pt",
            }}
            aria-level={2}
          >
            <p
              dir="ltr"
              style={{
                lineHeight: "1.4000000000000001",
                marginRight: "12.1pt",
                textAlign: "justify",
                marginTop: "3.35pt",
                marginBottom: "0pt",
              }}
            >
              <span
                style={{
                  fontSize: "10pt",
                  fontFamily: "Arial,sans-serif",
                  color: "#000000",
                  backgroundColor: "transparent",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontVariant: "normal",
                  textDecoration: "none",
                  verticalAlign: "baseline",
                  whiteSpace: "pre-wrap",
                }}
              >
                Where versions of these General Terms exist in any other
                language, the English language version shall prevail.
              </span>
            </p>
          </li>
        </ol>
      </View>
    </Screen>
  );
};
