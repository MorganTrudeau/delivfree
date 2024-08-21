import {
  Linking,
  Pressable,
  ScrollView,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React, { useRef } from "react";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";

export const PrivacyPolicy = () => {
  const scrollView = useRef<ScrollView>(null);
  const sectionRefs = useRef<{
    [key in SectionId]?: View;
  }>({});

  const setSectionRef = (id: SectionId) => (ref: View) => {
    sectionRefs.current = { ...sectionRefs.current, [id]: ref };
  };

  const scrollToSection = (id: SectionId) => () => {
    const sectionRef = sectionRefs.current[id];
    console.log("sectionRef", sectionRef);
    if (!sectionRef) {
      return;
    }
    sectionRef.measure((x, y, w, h, px, py) => {
      console.log("py", py, y);
      console.log("scrollView.current", scrollView.current?.scrollTo);
      scrollView.current?.scrollTo({ y, x: 0 });
    });
  };

  return (
    <ScrollView
      ref={scrollView}
      style={{
        backgroundColor: colors.background,
        padding: spacing.xxl,
        flex: 1,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={$section}>
        <Text preset="heading" style={$heading}>
          Privacy policy
        </Text>
        <Text style={$p}>
          We respect your privacy and are committed to protecting it through our
          compliance with this privacy policy (“Policy”). This Policy describes
          the types of information we may collect from you or that you may
          provide (“Personal Information”) on the delivfree.com website
          (“Website”), “DelivFree” mobile application (“Mobile Application”),
          and any of their related products and services (collectively,
          “Services”), and our practices for collecting, using, maintaining,
          protecting, and disclosing that Personal Information. It also
          describes the choices available to you regarding our use of your
          Personal Information and how you can access and update it.
        </Text>
        <Text style={$p}>
          This Policy is a legally binding agreement between you (“User”, “you”
          or “your”) and DelivFree Canada Inc. (doing business as “DelivFree”,
          “we”, “us” or “our”). If you are entering into this Policy on behalf
          of a business or other legal entity, you represent that you have the
          authority to bind such entity to this Policy, in which case the terms
          “User”, “you” or “your” shall refer to such entity. If you do not have
          such authority, or if you do not agree with the terms of this Policy,
          you must not accept this Policy and may not access and use the
          Services. By accessing and using the Services, you acknowledge that
          you have read, understood, and agree to be bound by the terms of this
          Policy. This Policy does not apply to the practices of companies that
          we do not own or control, or to individuals that we do not employ or
          manage.
        </Text>
      </View>

      <View style={$section}>
        <Text preset="semibold" style={$subheading}>
          Table of contents
        </Text>
        {TABLE_OF_CONTENTS.map(({ label, id }, index) => {
          return (
            <Pressable key={id} onPress={scrollToSection(id)}>
              <Text style={$li}>
                {index + 1}. {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={$section} ref={setSectionRef("toc1")}>
        <Text preset="semibold" style={$subheading}>
          Collection of personal information
        </Text>
        <Text style={$p}>
          You can access and use the Services without telling us who you are or
          revealing any information by which someone could identify you as a
          specific, identifiable individual. If, however, you wish to use some
          of the features offered on the Services, you may be asked to provide
          certain Personal Information (for example, your name and e-mail
          address).
        </Text>

        <Text style={$p}>
          We receive and store any information you knowingly provide to us when
          you create an account, make a purchase, or fill any forms on the
          Services. When required, this information may include the following:
        </Text>

        <View style={$p}>
          <List
            items={[
              "Account details (such as user name, unique user ID, password, etc)",
              "Contact information (such as email address, phone number, etc)",
              "Basic personal information (such as name, country of residence, etc)",
              "Proof of identity (such as a photocopy of a government ID)",
              "Payment information (such as credit card details, bank details, etc)",
              "Geolocation data of your device (such as latitude and longitude)",
            ]}
          />
        </View>

        <Text style={$p}>
          Some of the information we collect is directly from you via the
          Services. However, we may also collect Personal Information about you
          from other sources such as social media platforms and our joint
          partners. Personal Information we collect from other sources may
          include demographic information, such as age and gender, device
          information, such as IP addresses, location, such as city and state,
          and online behavioral data, such as information about your use of
          social media websites, page view information and search results and
          links.
        </Text>

        <Text style={$p}>
          You can choose not to provide us with your Personal Information, but
          then you may not be able to take advantage of some of the features on
          the Services. Users who are uncertain about what information is
          mandatory are welcome to contact us.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc2")}>
        <Text preset="subheading" style={$subheading}>
          Use and processing of collected information
        </Text>
        <Text style={$p}>
          We act as a data controller and a data processor when handling
          Personal Information, unless we have entered into a data processing
          agreement with you in which case you would be the data controller and
          we would be the data processor.
        </Text>
        <Text style={$p}>
          Our role may also differ depending on the specific situation involving
          Personal Information. We act in the capacity of a data controller when
          we ask you to submit your Personal Information that is necessary to
          ensure your access and use of the Services. In such instances, we are
          a data controller because we determine the purposes and means of the
          processing of Personal Information.
        </Text>
        <Text style={$p}>
          We act in the capacity of a data processor in situations when you
          submit Personal Information through the Services. We do not own,
          control, or make decisions about the submitted Personal Information,
          and such Personal Information is processed only in accordance with
          your instructions. In such instances, the User providing Personal
          Information acts as a data controller.
        </Text>
        <Text style={$p}>
          In order to make the Services available to you, or to meet a legal
          obligation, we may need to collect and use certain Personal
          Information. If you do not provide the information that we request, we
          may not be able to provide you with the requested products or
          services. Any of the information we collect from you may be used for
          the following purposes:
        </Text>
        <List
          items={[
            "Create and manage user accounts",
            "Deliver products or services",
            "Improve products and services",
            "Send administrative information",
            "Send marketing and promotional communications",
            "Send product and service updates",
            "Respond to inquiries and offer support",
            "Request user feedback",
            "Improve user experience",
            "Post customer testimonials",
            "Deliver targeted advertising",
            "Enforce terms and conditions and policies",
            "Protect from abuse and malicious users",
            "Respond to legal requests and prevent harm",
            "Run and operate the Services",
          ]}
        />
        <Text style={$p}>
          Processing your Personal Information depends on how you interact with
          the Services, where you are located in the world and if one of the
          following applies: (a) you have given your consent for one or more
          specific purposes; (b) provision of information is necessary for the
          performance of this Policy with you and/or for any pre-contractual
          obligations thereof; (c) processing is necessary for compliance with a
          legal obligation to which you are subject; (d) processing is related
          to a task that is carried out in the public interest or in the
          exercise of official authority vested in us; (e) processing is
          necessary for the purposes of the legitimate interests pursued by us
          or by a third party. We may also combine or aggregate some of your
          Personal Information in order to better serve you and to improve and
          update our Services.
        </Text>
        <Text style={$p}></Text>We rely on the following legal bases upon which
        we collect and process your Personal Information:
        <List
          items={[
            "User’s consent",
            "Performance of a contract",
            "Compliance with the law and legal obligations",
            "Our own legitimate interests",
            "Personal Information is already publicly available",
          ]}
        />
        <Text style={$p}>
          Note that under some legislations we may be allowed to process
          information until you object to such processing by opting out, without
          having to rely on consent or any other of the legal bases above. In
          any case, we will be happy to clarify the specific legal basis that
          applies to the processing, and in particular whether the provision of
          Personal Information is a statutory or contractual requirement, or a
          requirement necessary to enter into a contract.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc3")}>
        <Text preset={"subheading"} style={$subheading}>
          Payment processing
        </Text>
        <Text style={$p}>
          In case of Services requiring payment, you may need to provide your
          credit card details or other payment account information, which will
          be used solely for processing payments. We use third-party payment
          processors (“Payment Processors”) to assist us in processing your
          payment information securely. We will share payment data with the
          Payment Processors only to the extent necessary for the purposes of
          processing your payments, refunding such payments, and dealing with
          complaints and queries related to such payments and refunds.
        </Text>

        <Text style={$p}>
          Please note that the Payment Processors may collect some Personal
          Information from you, which allows them to process your payments
          (e.g., your email address, address, credit card details, and bank
          account number) and handle all the steps in the payment process
          through their systems, including data collection and data processing.
          Where necessary for processing future or recurring payments and
          subject to your prior consent, your financial information will be
          stored in encrypted form on secure servers of our Payment Processors.
          The Payment Processors’ use of your Personal Information is governed
          by their respective privacy policies which may or may not contain
          privacy protections as protective as this Policy. We suggest that you
          review their respective privacy policies.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc4")}>
        <Text preset={"subheading"} style={$subheading}>
          Managing information
        </Text>
        <Text style={$p}>
          You are able to delete certain Personal Information we have about you.
          The Personal Information you can delete may change as the Services
          change. When you delete Personal Information, however, we may maintain
          a copy of the unrevised Personal Information in our records for the
          duration necessary to comply with our obligations to our affiliates
          and partners, and for the purposes described below. If you would like
          to delete your Personal Information or permanently delete your
          account, you can do so by contacting us.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc5")}>
        <Text preset={"subheading"} style={$subheading}>
          Disclosure of information
        </Text>
        <Text style={$p}>
          Depending on the requested Services or as necessary to complete any
          transaction or provide any Service you have requested, we may share
          your information with our contracted companies, and service providers
          (collectively, “Service Providers”) we rely upon to assist in the
          operation of the Services available to you and whose privacy policies
          are consistent with ours or who agree to abide by our policies with
          respect to Personal Information. We will not share any personally
          identifiable information with third parties and will not share any
          information with unaffiliated third parties.
        </Text>
        <Text style={$p}>
          Service Providers are not authorized to use or disclose your
          information except as necessary to perform services on our behalf or
          comply with legal requirements. Service Providers are given the
          information they need only in order to perform their designated
          functions, and we do not authorize them to use or disclose any of the
          provided information for their own marketing or other purposes.
        </Text>
        <Text style={$p}>
          We may also disclose any Personal Information we collect, use or
          receive if required or permitted by law, such as to comply with a
          subpoena or similar legal process, and when we believe in good faith
          that disclosure is necessary to protect our rights, protect your
          safety or the safety of others, investigate fraud, or respond to a
          government request.
        </Text>
        <Text style={$p}>
          In the event we go through a business transition, such as a merger or
          acquisition by another company, or sale of all or a portion of its
          assets, your user account, and your Personal Information will likely
          be among the assets transferred.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc6")}>
        <Text preset={"subheading"} style={$subheading}>
          Retention of information
        </Text>
        <Text style={$p}>
          We will retain and use your Personal Information for the period
          necessary to comply with our legal obligations, as long as your user
          account remains active, until the purchase order or Services are
          fulfilled, to enforce our Policy, resolve disputes, and unless a
          longer retention period is required or permitted by law.
        </Text>
        <Text style={$p}>
          We may use any aggregated data derived from or incorporating your
          Personal Information after you update or delete it, but not in a
          manner that would identify you personally. Once the retention period
          expires, Personal Information shall be deleted. Therefore, the right
          to access, the right to erasure, the right to rectification, and the
          right to data portability cannot be enforced after the expiration of
          the retention period.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc7")}>
        <Text preset={"subheading"} style={$subheading}>
          Transfer of information
        </Text>
        <Text style={$p}>
          Depending on your location, data transfers may involve transferring
          and storing your information in a country other than your own.
          However, this will not include countries outside the European Union
          and European Economic Area. If any such transfer takes place, you can
          find out more by checking the relevant sections of this Policy or
          inquire with us using the information provided in the contact section.
          Note that we are dedicated to ensuring the security of your personal
          data, adhering strictly to the guidelines outlined in our privacy
          notice and conforming to the applicable legal requirements.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc8")}>
        <Text preset={"subheading"} style={$subheading}>
          Region specific notices
        </Text>
        <Text style={$p}>
          Out of respect for your privacy, we have implemented additional
          measures to comply with the obligations and rights associated with the
          collection of Personal Information as dictated by the laws governing
          the regions of our users.
        </Text>
      </View>

      <View style={$section}>
        <Text preset={"subheading"} style={$subheading}>
          Disclosures for residents of Canada
        </Text>
        <Text style={$p}>
          If you are a resident of Canada, you have certain rights in relation
          to your Personal Information based on the Personal Information
          Protection and Electronic Documents Act (“PIPEDA”) that we comply with
          as part of our commitment to your privacy. This supplemental section,
          together with other relevant sections of the Policy, provides
          information about your rights and how to exercise them. Unless
          otherwise expressly stated, all terms in this section have the same
          meaning as defined in the PIPEDA.
        </Text>
        <Text style={$p}>
          (a) Right to access: You have the right to access the Personal
          Information we hold about you if you wish to review, verify, or
          correct your information.
        </Text>
        <Text style={$p}>
          (b) Right to correct: We strive to maintain the accuracy of your
          Personal Information and will promptly make necessary corrections when
          you identify inaccuracies in your data.
        </Text>
        <Text style={$p}>
          (c) Right withdraw consent: You can withdraw your consent regarding
          the handling of your Personal Information at any time, subject to
          legal or contractual limitations.
        </Text>
        <Text style={$p}>
          (d) Right to complain: You have the right to file a complaint with the
          Privacy Commissioner of Canada if you feel your Personal Information
          is being handled in a way that violates PIPEDA.
        </Text>
        <Text style={$p}>
          (e) Right to challenge compliance: You can challenge our compliance
          with PIPEDA, including how we handle your Personal Information,
          consent, access requests, and how we respond to your correction
          requests.
        </Text>
        <Text style={$p}>
          (f) Right to know about breaches: You have the right to be notified in
          cases of a security breach involving your Personal Information that
          poses a real risk of significant harm.
        </Text>
      </View>

      <View style={$section}>
        <Text preset={"subheading"} style={$subheading}>
          Disclosures for residents of the EU/EEA and the UK
        </Text>
        <Text style={$p}>
          If you are a resident of the European Union (“EU”), the European
          Economic Area (“EEA”), or the United Kingdom (“UK”), you have certain
          rights in relation to your Personal Information based on the the UK
          DPA that we comply with as part of our commitment to your privacy.
          Unless otherwise expressly stated, all terms in this section have the
          same meaning as defined in the UK DPA.
        </Text>
        <Text style={$p}>
          (a) Right to withdraw consent: You have the right to withdraw consent
          where you have previously given your consent to the processing of your
          Personal Information. To the extent that the legal basis for our
          processing of your Personal Information is consent, you have the right
          to withdraw that consent at any time. Withdrawal will not affect the
          lawfulness of processing before the withdrawal.
        </Text>
        <Text style={$p}>
          (b) Right to access: You have the right to learn if your Personal
          Information is being processed by us, obtain disclosure regarding
          certain aspects of the processing, and obtain a copy of your Personal
          Information undergoing processing.
        </Text>
        <Text style={$p}>
          (c) Right to rectification: You have the right to verify the accuracy
          of your information and ask for it to be updated or corrected. You
          also have the right to request us to complete the Personal Information
          you believe is incomplete.
        </Text>
        <Text style={$p}>
          (d) Right to object to the processing: You have the right to object to
          the processing of your information if the processing is carried out on
          a legal basis other than consent. Where Personal Information is
          processed for the public interest, in the exercise of an official
          authority vested in us, or for the purposes of the legitimate
          interests pursued by us, you may object to such processing by
          providing a ground related to your particular situation to justify the
          objection. You must know that, however, should your Personal
          Information be processed for direct marketing purposes, you can object
          to that processing at any time without providing any justification. To
          learn whether we are processing Personal Information for direct
          marketing purposes, you may refer to the relevant sections of this
          Policy.
        </Text>
        <Text style={$p}>
          (e) Right to restrict to the processing: You have the right, under
          certain circumstances, to restrict the processing of your Personal
          Information. These circumstances include: the accuracy of your
          Personal Information is contested by you and we must verify its
          accuracy; the processing is unlawful, but you oppose the erasure of
          your Personal Information and request the restriction of its use
          instead; we no longer need your Personal Information for the purposes
          of processing, but you require it to establish, exercise or defend
          your legal claims; you have objected to processing pending the
          verification of whether our legitimate grounds override your
          legitimate grounds. Where processing has been restricted, such
          Personal Information will be marked accordingly and, with the
          exception of storage, will be processed only with your consent or for
          the establishment, to exercise or defense of legal claims, for the
          protection of the rights of another natural, or legal person or for
          reasons of important public interest.
        </Text>
        <Text style={$p}>
          (f) Right to delete: You have the right, under certain circumstances,
          to obtain the erasure of your Personal Information from us. These
          circumstances include: the Personal Information is no longer necessary
          in relation to the purposes for which it was collected or otherwise
          processed; you withdraw consent to consent-based processing; you
          object to the processing under certain rules of applicable data
          protection law; the processing is for direct marketing purposes; and
          the personal data have been unlawfully processed. However, there are
          exclusions of the right to erasure such as where processing is
          necessary: for exercising the right of freedom of expression and
          information; for compliance with a legal obligation; or for the
          establishment, to exercise or defense of legal claims.
        </Text>
        <Text style={$p}>
          (g) Right to data portability: You have the right to receive your
          Personal Information that you have provided to us in a structured,
          commonly used, and machine-readable format and, if technically
          feasible, to have it transmitted to another controller without any
          hindrance from us, provided that such transmission does not adversely
          affect the rights and freedoms of others.
        </Text>
        <Text style={$p}>
          (h) Right to complaint: You have the right to complain to a data
          protection authority about our collection and use of your Personal
          Information. If you are not satisfied with the outcome of your
          complaint directly with us, you have the right to lodge a complaint
          with your local data protection authority. For more information,
          please contact your local data protection authority in the EU or the
          EEA. This provision is applicable provided that your Personal
          Information is processed by automated means and that the processing is
          based on your consent, on a contract which you are part of, or on
          pre-contractual obligations thereof.
        </Text>
      </View>

      <View style={$section}>
        <Text preset={"subheading"} style={$subheading}>
          Disclosures for residents of the USA
        </Text>
        <Text style={$p}>
          If you are a resident of California, Colorado, Connecticut, Delaware,
          Iowa, Maryland, Utah, or Virginia, you have certain rights and we aim
          to take reasonable steps to allow you to correct, amend, delete, or
          limit the use of your Personal Information. This supplemental section,
          together with other relevant sections of the Policy, provides
          information about your rights and how to exercise them under the
          California Consumer Privacy Act and the California Privacy Rights Act
          (collectively, “CCPA”), the Colorado Privacy Act (“CPA”), the
          Connecticut Data Privacy Act (“CDPA”), the Delaware Online Privacy and
          Protection Act (“DOPPA”), the Iowa Consumer Data Protection Act
          (“ICDPA”), the Maryland Personal Information Protection Act (“PIPA”),
          the Utah Consumer Privacy Act (“UCPA”), the Virginia Consumer Data
          Protection Act (“VCDPA”), and and any and all regulations arising
          therefrom. Unless otherwise expressly stated, all terms in this
          section have the same meaning as defined in the related state laws.
        </Text>
        <Text style={$p}>
          In addition to the rights as explained in this Policy, if you provide
          Personal Information as defined in the statute to obtain Services for
          personal, family, or household use, you have the right to submit
          requests related to your Personal Information once a calendar year.
          Note that there are circumstances when we may not be able to comply
          with your request such as when we are not be able to verify your
          request or we may find that providing a full response conflicts with
          other legal obligations or regulatory requirements. You will be
          notified if it’s the case.
        </Text>
        <Text style={$p}>
          (a) Right to know and right to access: You have the right to request
          certain information we have collected about you. Once we receive and
          confirm a verifiable request from you, we will disclose to you, to the
          extent permitted by law:
        </Text>
        <List
          items={[
            "The specific pieces of Personal Information we hold about you.",
            "The categories of sources from which Information about you is collected.",
            "The purposes for collecting, selling, or sharing your Personal Information.",
          ]}
        />
        <Text style={$p}>
          You have the right to request that the Personal Information to be
          delivered in a format that is both portable and easily usable, as long
          as it is technically possible to do so.
        </Text>
        <Text style={$p}>
          (b) Right to correct: You have the right to request that we correct
          your inaccurate Personal Information taking into account the nature of
          the Personal Information and the purposes of the processing of the
          Personal Information.
        </Text>
        <Text style={$p}>
          (c) Right to delete: You have the right to request deletion of your
          Personal Information.
        </Text>
        <Text style={$p}>
          (d) Right to opt-out of the sale and sharing: You have the right to
          opt-out of the sale of your Personal Information which may include
          selling, disclosing, or transferring Personal Information to another
          business or a third party for monetary or other valuable
          consideration.
        </Text>
        <Text style={$p}>
          (e) Right to consent to or limit the use of your sensitive personal
          information: You have the right to consent to the use of your
          Sensitive Personal information and to direct us to restrict its use
          and disclosure solely to what is essential for carrying out or
          delivering the Services in a manner reasonably anticipated by an
          average user, or for certain business objectives as specified by law.
          However, we do not use Sensitive Personal Information for any purposes
          other than those legally permitted or beyond the scope of your
          consent.
        </Text>
        <Text style={$p}>
          (f) Right to non-discrimination: You have the right to not be
          discriminated against in the Services or quality of Services you
          receive from us for exercising your rights. We may not, and will not,
          treat you differently because of your data subject request activity,
          and we may not and will not deny goods or Services to you, charge
          different rates for goods or Services, provide a different level
          quality of goods or Services, or suggest that we would treat you
          differently because of your data subject request activity.
        </Text>
        <Text style={$p}>
          (g) Shine the Light: California residents that have an established
          business relationship with us have the right to know how their
          personal information is disclosed to third parties for their direct
          marketing purposes under California’s “Shine the Light” law, or the
          right to opt out of such practices.
        </Text>
        <Text style={$p}>
          To exercise any of your rights, simply contact us using the details
          below. After we receive and verify your request, we will process it to
          the extent possible within our capabilities.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc9")}>
        <Text preset={"subheading"} style={$subheading}>
          How to exercise your rights
        </Text>
        <Text style={$p}>
          Any requests to exercise your rights can be directed to us through the
          contact details provided in this document. Please note that we may ask
          you to verify your identity before responding to such requests. Your
          request must provide sufficient information that allows us to verify
          that you are the person you are claiming to be or that you are the
          authorized representative of such person. If we receive your request
          from an authorized representative, we may request evidence that you
          have provided such an authorized representative with power of attorney
          or that the authorized representative otherwise has valid written
          authority to submit requests on your behalf.
        </Text>
        <Text style={$p}>
          You must include sufficient details to allow us to properly understand
          the request and respond to it. We cannot respond to your request or
          provide you with Personal Information unless we first verify your
          identity or authority to make such a request and confirm that the
          Personal Information relates to you.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc10")}>
        <Text preset={"subheading"} style={$subheading}>
          Data analytics
        </Text>
        <Text style={$p}>
          Our Services may use third-party analytics tools that use cookies, web
          beacons, or other similar information-gathering technologies to
          collect standard internet activity and usage information. The
          information gathered is used to compile statistical reports on User
          activity such as how often Users visit our Services, what pages they
          visit and for how long, etc. We use the information obtained from
          these analytics tools to monitor the performance and improve our
          Services.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc11")}>
        <Text preset={"subheading"} style={$subheading}>
          Privacy of children
        </Text>
        <Text style={$p}>
          We do not knowingly collect any Personal Information from children
          under the age of 13. If you are under the age of 13, please do not
          submit any Personal Information through the Services. If you have
          reason to believe that a child under the age of 13 has provided
          Personal Information to us through the Services, please contact us to
          request that we delete that child’s Personal Information from our
          Services.
        </Text>
        <Text style={$p}>
          We encourage parents and legal guardians to monitor their children’s
          Internet usage and to help enforce this Policy by instructing their
          children never to provide Personal Information through the Services
          without their permission. We also ask that all parents and legal
          guardians overseeing the care of children take the necessary
          precautions to ensure that their children are instructed to never give
          out Personal Information when online without their permission.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc12")}>
        <Text preset={"subheading"} style={$subheading}>
          Do not sell my personal information
        </Text>
        <Text style={$p}>
          You have the right to choose not to have your Personal Information
          sold or dislcosed by contacting us. Upon receiving and verifying your
          request, we will cease the sale and disclosure of your Personal
          Information. Be aware, however, that opting out of data transfers to
          our third parties might affect our ability to provide certain Services
          you have signed up for. We reserve the right to reject opt-out
          requests in certain situations as permitted by the CCPA, such as when
          the sale of Personal Information is required for us to fulfill legal
          or contractual duties.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc13")}>
        <Text preset={"subheading"} style={$subheading}>
          Do Not Track signals
        </Text>
        <Text style={$p}>
          Some browsers incorporate a Do Not Track feature that signals to
          websites you visit that you do not want to have your online activity
          tracked. Tracking is not the same as using or collecting information
          in connection with a website. For these purposes, tracking refers to
          collecting personally identifiable information from users who use or
          visit a website or online service as they move across different
          websites over time. How browsers communicate the Do Not Track signal
          is not yet uniform. As a result, the Services are not yet set up to
          interpret or respond to Do Not Track signals communicated by your
          browser. Even so, as described in more detail throughout this Policy,
          we limit our use and collection of your Personal Information. For a
          description of Do Not Track protocols for browsers and mobile devices
          or to learn more about the choices available to you, visit{" "}
          <Link href="https://www.internetcookies.com">
            internetcookies.com
          </Link>
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc14")}>
        <Text preset={"subheading"} style={$subheading}>
          Advertisements
        </Text>

        <Text style={$p}>
          We may display online advertisements and we may share aggregated and
          non-identifying information about our customers that we or our
          advertisers collect through your use of the Services. We do not share
          personally identifiable information about individual customers with
          advertisers. In some instances, we may use this aggregated and
          non-identifying information to deliver tailored advertisements to the
          intended audience.
        </Text>

        <Text style={$p}>
          We may also permit certain third-party companies to help us tailor
          advertising that we think may be of interest to Users and to collect
          and use other data about User activities on the Services. These
          companies may deliver ads that might place cookies and otherwise track
          User behavior.
        </Text>

        <Text style={$p}>
          If you would like more information about your choices to opt-in or
          opt-out of this data collection, please visit{" "}
          <Link href="http://optout.aboutads.info/">
            Digital Advertising Alliance website
          </Link>{" "}
          and{" "}
          <Link href="http://optout.networkadvertising.org/">
            Network Advertising Initiative website
          </Link>{" "}
          to learn more information about interest-based advertising.
        </Text>

        <Text style={$p}>
          You may also download the AppChoices app at{" "}
          <Link href="https://youradchoices.com/appchoices">
            Digital Advertising Alliance’s AppChoices app
          </Link>{" "}
          to opt out in connection with mobile apps, or use the platform
          controls on your mobile device to opt out.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc15")}>
        <Text preset={"subheading"} style={$subheading}>
          Social media features
        </Text>
        <Text style={$p}>
          Our Services may include social media features, such as the Facebook
          and Twitter buttons, Share This buttons, etc (collectively, “Social
          Media Features”). These Social Media Features may collect your IP
          address, what page you are visiting on our Services, and may set a
          cookie to enable Social Media Features to function properly. Social
          Media Features are hosted either by their respective providers or
          directly on our Services. Your interactions with these Social Media
          Features are governed by the privacy policy of their respective
          providers.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc16")}>
        <Text preset={"subheading"} style={$subheading}>
          Push notifications
        </Text>
        <Text style={$p}>
          We offer push notifications to which you may voluntarily subscribe at
          any time. To make sure push notifications reach the correct devices,
          we use a third-party push notifications provider who relies on a
          device token unique to your device which is issued by the operating
          system of your device. While it is possible to access a list of device
          tokens, they will not reveal your identity, your unique device ID, or
          your contact information to us or our third-party push notifications
          provider. We will maintain the information sent via e-mail in
          accordance with applicable laws and regulations. If, at any time, you
          wish to stop receiving push notifications, simply adjust your device
          settings accordingly.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc17")}>
        <Text preset={"subheading"} style={$subheading}>
          Affiliate links
        </Text>
        <Text style={$p}>
          We may engage in affiliate marketing and have affiliate links present
          on the Services for the purpose of being able to offer you related or
          additional products and services. If you click on an affiliate link, a
          cookie will be placed on your browser to track any sales for purposes
          of commissions.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc18")}>
        <Text preset={"subheading"} style={$subheading}>
          Links to other resources
        </Text>
        <Text style={$p}>
          The Services contain links to other resources that are not owned or
          controlled by us. Please be aware that we are not responsible for the
          privacy practices of such other resources or third parties. We
          encourage you to be aware when you leave the Services and to read the
          privacy statements of each and every resource that may collect
          Personal Information.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc19")}>
        <Text preset={"subheading"} style={$subheading}>
          Information security
        </Text>
        <Text style={$p}>
          No data transmission over the Internet or wireless network can be
          guaranteed. Therefore, while we strive to protect your Personal
          Information, you acknowledge that (a) there are security and privacy
          limitations of the Internet which are beyond our control; (b) the
          security, integrity, and privacy of any and all information and data
          exchanged between you and the Services cannot be guaranteed; and (c)
          any such information and data may be viewed or tampered with in
          transit by a third party, despite best efforts.
        </Text>
        <Text style={$p}>
          As the security of Personal Information depends in part on the
          security of the device you use to communicate with us and the security
          you use to protect your credentials, please take appropriate measures
          to protect this information.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc20")}>
        <Text preset={"subheading"} style={$subheading}>
          Data breach
        </Text>
        <Text style={$p}>
          In the event we become aware that the security of the Services has
          been compromised or Users’ Personal Information has been disclosed to
          unrelated third parties as a result of external activity, including,
          but not limited to, security attacks or fraud, we reserve the right to
          take reasonably appropriate measures, including, but not limited to,
          investigation and reporting, as well as notification to and
          cooperation with law enforcement authorities. In the event of a data
          breach, we will make reasonable efforts to notify affected individuals
          if we believe that there is a reasonable risk of harm to the User as a
          result of the breach or if notice is otherwise required by law. When
          we do, we will post a notice on the Services, send you an email.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc21")}>
        <Text preset={"subheading"} style={$subheading}>
          Changes and amendments
        </Text>
        <Text style={$p}>
          We reserve the right to modify this Policy or its terms related to the
          Services at any time at our discretion. When we do, we will revise the
          updated date at the bottom of this page, post a notification within
          the Services. We may also provide notice to you in other ways at our
          discretion, such as through the contact information you have provided.
        </Text>
        <Text style={$p}>
          An updated version of this Policy will be effective immediately upon
          the posting of the revised Policy unless otherwise specified. Your
          continued use of the Services after the effective date of the revised
          Policy (or such other act specified at that time) will constitute your
          consent to those changes. However, we will not, without your consent,
          use your Personal Information in a manner materially different than
          what was stated at the time your Personal Information was collected.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc22")}>
        <Text preset={"subheading"} style={$subheading}>
          Acceptance of this policy
        </Text>
        <Text style={$p}>
          You acknowledge that you have read this Policy and agree to all its
          terms and conditions. By accessing and using the Services and
          submitting your information you agree to be bound by this Policy. If
          you do not agree to abide by the terms of this Policy, you are not
          authorized to access or use the Services.
        </Text>
      </View>

      <View style={$section} ref={setSectionRef("toc23")}>
        <Text preset={"subheading"} style={$subheading}>
          Contacting us
        </Text>
        <Text style={$p}>
          If you have any questions regarding the information we may hold about
          you or if you wish to exercise your rights, you may use the following
          data subject request form to submit your request:
        </Text>
        <Text style={$p}>
          <Link href="https://app.websitepolicies.com/dsar/view/cio7qt4v">
            Submit a data access request
          </Link>
        </Text>
        <Text style={$p}>
          If you have any other questions, concerns, or complaints regarding
          this Policy, we encourage you to contact us using the details below:
        </Text>
        <Text style={$p}>
          <Link href="mailto:info@delivfree.com">info@delivfree.com</Link>
        </Text>
        <Text style={$p}>
          We will attempt to resolve complaints and disputes and make every
          reasonable effort to honor your wish to exercise your rights as
          quickly as possible and in any event, within the timescales provided
          by applicable data protection laws.
        </Text>
        <Text style={$p}>This document was last updated on June 24, 2024</Text>
      </View>
    </ScrollView>
  );
};

const List = ({ items }: { items: string[] }) =>
  items.map((str) => (
    <Text style={$text} key={str}>
      {"\u2022"} {str}
    </Text>
  ));

const Link = ({
  href,
  children,
}: {
  href: string;
  children: ViewProps["children"];
}) => {
  const go = async () => {
    try {
      await Linking.openURL(href);
    } catch (e) {
      alert("Failed to open site.");
    }
  };
  return (
    <Pressable onPress={go}>
      <Text style={[$text, { color: "#06c" }]}>{children}</Text>
    </Pressable>
  );
};

const TABLE_OF_CONTENTS = [
  { label: "Collection of personal information", id: "toc1" },
  { label: "Use and processing of collected information", id: "toc2" },
  { label: "Payment processing", id: "toc3" },
  { label: "Managing information", id: "toc4" },
  { label: "Disclosure of information", id: "toc5" },
  { label: "Retention of information", id: "toc6" },
  { label: "Transfer of information", id: "toc7" },
  { label: "Region specific notices", id: "toc8" },
  { label: "How to exercise your rights", id: "toc9" },
  { label: "Data analytics", id: "toc10" },
  { label: "Privacy of children", id: "toc11" },
  { label: "Do not sell my personal information", id: "toc12" },
  { label: "Do Not Track signals", id: "toc13" },
  { label: "Advertisements", id: "toc14" },
  { label: "Social media features", id: "toc15" },
  { label: "Push notifications", id: "toc16" },
  { label: "Affiliate links", id: "toc17" },
  { label: "Links to other resources", id: "toc18" },
  { label: "Information security", id: "toc19" },
  { label: "Data breach", id: "toc20" },
  { label: "Changes and amendments", id: "toc21" },
  { label: "Acceptance of this policy", id: "toc22" },
  { label: "Contacting us", id: "toc23" },
] as const;
type SectionId = (typeof TABLE_OF_CONTENTS)[number]["id"];

const $section: ViewStyle = { paddingBottom: 30 };
const $heading: TextStyle = { marginBottom: spacing.md };
const $subheading: TextStyle = { marginVertical: spacing.sm, fontSize: 24 };
const $li: TextStyle = {
  paddingVertical: spacing.xxs,
  lineHeight: 30,
  color: "#06c",
  marginLeft: 10,
};
const $p: TextStyle = { paddingVertical: spacing.sm, lineHeight: 35 };
const $text: TextStyle = { lineHeight: 35 };
