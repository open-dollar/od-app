import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

// Components
import GridContainer from '../components/GridContainer'

// Utils
import _ from '../utils/lodash'

// Styles
import { ExternalLinkArrow } from '../GlobalStyle'

const Privacy = ({ ...props }) => {
    const cookiesRef = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            if (
                _.get(props.location, 'state.goToCookies', false) &&
                cookiesRef.current
            ) {
                // @ts-ignore
                cookiesRef.current.scrollIntoView({ behavior: 'smooth' })
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 500)
        // eslint-disable-next-line
    }, [])

    return (
        <GridContainer>
            <InnterContent>
                <Title>Reflexer Labs User Agreement</Title>
                <Date>Updated October 28th 2020</Date>
                <p>
                    By using the Reflexer website, mobile application (the
                    &ldquo;App&rdquo;), and services, (collectively, the
                    &ldquo;Services&rdquo;), you consent to the following
                    privacy policy.&nbsp;
                </p>
                <p>
                    Your right to privacy and control over your personal
                    information is important to us at Reflexer. To ensure that
                    you understand how we collect and use personal data as part
                    of the Services, please note the information below.
                </p>
                <h3>
                    <strong>1. Responsible body</strong>
                </h3>
                <p>
                    Responsible body for the collection, processing, and use of
                    your personal information through the Services is
                </p>
                <p>Reflexer Labs, Inc.</p>
                <p>Address: 4023 Kennett Pike #50387, Wilmington, DE 19807</p>
                <p>Tel.: +1 302-219-0308</p>
                <p>
                    Email:{' '}
                    <a href="mailto:contact@reflexer.finance">
                        contact@reflexer.finance
                    </a>
                    &nbsp;
                </p>
                <p>
                    For any questions about privacy in connection with the
                    Services, you can always contact us using the contact
                    information, above.
                </p>
                <h3>
                    <strong>
                        2. General collection, processing and use of personal
                        data in the context of the use of the App
                    </strong>
                </h3>
                <p>
                    When you use the Services, we collect the following data:
                    your email address.
                </p>
                <p>
                    We do not collect metadata or other personally identifiable
                    information, although that may change over time.
                </p>
                <p>
                    We use your email address to send you a periodic (typically
                    monthly) report. By using the Services, you consent to our
                    collection of your email address, and you consent to us
                    sending you email to help provide you with the services.{' '}
                </p>
                <p>
                    The legal basis for the data processing described in this
                    section is your consent, and also the fulfillment of our
                    obligations and provision of Services.&nbsp;
                </p>
                <h3>
                    <strong>3. Use of the Services</strong>
                </h3>
                <p>
                    All the information you upload to the Services are stored on
                    an appropriate server infrastructure for processing. Data is
                    stored on servers located in the United States until
                    deleted. BY CONSENTING TO THE PRIVACY POLICY, YOU ARE
                    CONSENTING TO YOUR DATA BEING SENT TO, STORED IN, AND
                    PROCESSED IN, THE UNITED STATES. Presently, data is stored
                    for five(5) years, but this may change over time. For any
                    files we keep, we keep them for the sole purpose of giving
                    you and your designated third parties access to the files
                    and data for as long as you need them. During that time, we
                    may view that data to, for example, troubleshoot problems,
                    or to gather anonymized user data.{' '}
                </p>
                <p>The legal basis of the processing is your consent.</p>
                <h3 ref={cookiesRef}>
                    <strong>4. Use of our own Internet cookies</strong>
                </h3>
                <p>
                    We use cookies on the website. These are small files that
                    your browser automatically creates and displays on your
                    device (laptop, tablet, smartphone, etc.) when you access
                    the Services. Cookies do not harm your device, do not
                    contain viruses, Trojans, or other malicious software.
                    Cookie information is stored, and may result in a connection
                    with a specific terminal or browser being used. This does
                    not, however, mean that we are immediately aware of your
                    identity. The use of cookies serves to increase the
                    usability of the Services. For example, we use session
                    cookies to recognize that you have already visited
                    individual pages, or that you have completed certain tasks
                    or reached certain goals. These are automatically deleted
                    after leaving the Services. In addition, to improve
                    usability, we also use temporary cookies that are stored on
                    your device for a specified period of time, typically 30
                    days. If you access the Services again, it will
                    automatically recognize that you have already been with us
                    and what inputs and settings you have made, so you do not
                    have to re-enter them. We also use cookies to statistically
                    record the use of the Services, and to evaluate that use for
                    the purpose of optimizing the Services. These cookies allow
                    us to automatically recognize that you have already been
                    with us when you once again access the Services. These
                    cookies are automatically deleted after a defined time. Most
                    browsers accept cookies automatically. However, you can
                    configure your browser so that no cookies are stored on your
                    computer or always provide a hint appearing before a new
                    cookie is created. However, disabling cookies completely may
                    mean that you cannot use all features of the Services.
                </p>
                <p>
                    Most browsers accept cookies automatically but allow you to
                    disable them. You also can opt-out of certain cookies using
                    the following link:
                    http://optout.networkadvertising.org/?c=1. You can reset
                    your browser to refuse all cookies or to indicate when a
                    cookie is being sent. Some features of the Services may not
                    work properly without cookies. To learn more about cookies
                    generally, visit www.allaboutcookies.org and
                    http://optout.aboutads.info/?c=2&amp;lang=EN.
                </p>
                <p>
                    Some web browsers (including Safari, Internet Explorer,
                    Firefox, and Chrome) incorporate a &ldquo;Do Not
                    Track&rdquo; (&ldquo;DNT&rdquo;) or similar feature that
                    signals to websites that a User does not want to have his or
                    her online activity and behavior tracked. If a website that
                    responds to a particular DNT signal receives the DNT signal,
                    the browser can block that website from collecting certain
                    information about the browser&rsquo;s User. Not all browsers
                    offer a DNT option and DNT signals are not yet uniform.
                    Because there is not yet an accepted standard for how to
                    respond to browser DNT signals, we do not currently respond
                    to them. You also can typically remove and reject Cookies or
                    Local Storage from the Services with your browser settings.
                    Many browsers are set to accept Cookies and Local Storage
                    until you change your settings. If you remove or reject
                    Cookies or Local Storage, it could affect how the Services
                    work for you. In all circumstances, we may perform the
                    foregoing information collection practices directly or use a
                    third-party vendor to perform these functions on our behalf.
                    Also, if you access the Website or the Services from a
                    social networking service, we may share information with
                    such social networking service in accordance with this
                    Privacy Policy and to the extent permitted by your agreement
                    with such social networking service and its privacy
                    settings.
                </p>
                <p>
                    We may also use other technologies such as Local Storage and
                    Pixel Tags. &ldquo;Local Storage&rdquo; is an
                    industry-standard technology that allows a website or
                    application to store and retrieve data on a person&rsquo;s
                    computer, mobile phone or other device. We may use device or
                    HTML5 Local Storage, caching or other forms of Local Storage
                    to store your preferences, help us remember certain
                    information about how you interact with the Services or
                    display content on the through the Services based upon what
                    you have viewed on various other websites. We may also use
                    &ldquo;pixel tags,&rdquo; &ldquo;web beacons,&rdquo;
                    &ldquo;clear GIFs&rdquo; or similar means (individually or
                    collectively, &ldquo;Pixel Tags&rdquo;) in connection with
                    the Services to collect usage, demographic and geographical
                    location data. A Pixel Tag is an electronic image, often a
                    single pixel, that is ordinarily not visible to you and may
                    be associated with Cookies on your hard drive or Local
                    Storage. Pixel Tags allow us to count the number of users
                    who have visited certain pages or parts of the Services, to
                    deliver branded services and to help determine the
                    effectiveness of promotional or advertising campaigns. In
                    addition, we may from time to time work with third-party
                    companies, including advertisers, that use Cookies, Local
                    Storage and other tracking technologies to collect
                    non-identifying information about your activities on the
                    Website or the Services in order to help us better
                    understand the use and operation of the Website and the
                    Services. These third parties may collect and analyze
                    information about your online activities over time and
                    across different websites when you access or use the
                    Services. We do not exercise control over these third party
                    websites or services. We encourage you to read the privacy
                    policies or statements of the other websites and services
                    you use. By accepting this Privacy Policy, and by accessing
                    or using the Website or the Services, you are consenting to
                    permit the use of Cookies, Local Storage and Pixel Tags by
                    us and the third-party companies with which we work.
                </p>
                <h5>
                    <em>Reasons for using cookie-related technology</em>
                </h5>
                <p>
                    Some cookies are required for the Services to operate. Other
                    cookies enable us to track your interests, to enhance your
                    experience while using the Services, or to target
                    advertising.
                </p>
                <p>
                    The types of cookies we may use in the Services and why they
                    are used is as follows:
                </p>
                <ul>
                    <li>
                        <p>
                            &ldquo;Strictly necessary&rdquo; cookies are
                            required to allow us to deliver the Services to you.
                        </p>
                    </li>
                    <li>
                        <p>
                            &ldquo;Performance&rdquo; or &ldquo;Analytics&rdquo;
                            cookies help us to collect information about how
                            Users interact with the Services and help us analyze
                            and improve the Services. Performance or analytics
                            cookies remain on your computer after you close your
                            browser until you delete them.
                        </p>
                    </li>
                    <li>
                        <p>
                            &ldquo;Advertising&rdquo; cookies are used to make
                            advertising messages more relevant to you. They help
                            to display advertisements that are based on your
                            inferred interests, prevent the same ad from
                            appearing too often and ensure that ads are properly
                            displayed.
                        </p>
                    </li>
                </ul>
                <p>
                    By using our cookies, we want to optimize your experience
                    while using the Services. These Services are based on our
                    aforementioned legitimate interests, which at the same time
                    represents the legal basis for the data processing described
                    here.
                </p>
                <h3>
                    <strong>5. Use of analytics and additional services</strong>
                </h3>
                <p>
                    We do not use web analytics. You can prevent the
                    installation of cookies by setting your software
                    accordingly. Of you limit or prevent the installation of
                    cookies, however, some features of the Services may not be
                    fully exploited, or exploited at all. You can prevent the
                    collection by analytics data by opting out of the collection
                    of such data. In that case, an opt-out cookie will be set
                    which will prevent the future collection of your data when
                    you access the Services. If you delete your cookies, you
                    must reset the opt-out cookie again.&nbsp;
                </p>
                <h3>
                    <strong>6. Social media plug-ins</strong>
                </h3>
                <p>
                    We may use Social Plug-ins in the Services from, for
                    example, Facebook, Instagram, Twitter, and LinkedIn to
                    increase awareness of the Services, and for promotional
                    purposes. We are not responsible for activity or content
                    found on those (and any other) third-party sites. Please
                    note that a link to a third-party website or service does
                    not mean that we have reviewed or endorsed its privacy
                    practices. If you visit a third-party website or service,
                    you are subject to its privacy practices and policies, not
                    ours. This privacy policy does not apply to any personal
                    information that you provide to these other websites and
                    services.
                </p>
                <h3>
                    <strong>7. Server location</strong>
                </h3>
                <p>
                    The servers on which user data is collected, stored, and
                    used are located in the United States. By using the App, you
                    consent to the transmission of your data to the United
                    States.&nbsp;
                </p>
                <h3>
                    <strong>8. Emails</strong>
                </h3>
                <p>
                    For all email collection and use, we use the so-called
                    double opt-in procedure in the European Union only. After
                    providing us with your email, we will send you a
                    notification email asking you to confirm that you wish to
                    receive additional information from Reflexer by clicking on
                    a link in that email.&nbsp;
                </p>
                <p>
                    If you no longer wish to receive information via email from
                    us, you can unsubscribe at any time without incurring any
                    costs other than the transmission costs according to the
                    basic rates. You will find an unsubscribe link in any of our
                    emails, and if you chose to unsubscribe, we will then delete
                    your email address from our mailing list. Note that even if
                    you ask us to unsubscribe you, we may still use your email
                    address when you request a password reset.{' '}
                </p>
                <h3>
                    <strong>
                        9. Affected rights for users subject to GDPR
                    </strong>
                </h3>
                <p>
                    In connection with the data processing presented here, you
                    have the right to:
                </p>
                <ul>
                    <li>
                        <p>
                            Request information about your personal data
                            processed by us. In particular, you can request
                            information on the processing purposes, the category
                            of personal data, the categories of recipients to
                            whom your data has been disclosed, the planned
                            retention period, the right to rectification,
                            deletion, limitation of processing or opposition,
                            the existence of the right to complain, the source
                            of their data, if not collected from us, and the
                            existence of automated decision-making including
                            profiling and, where appropriate, meaningful
                            information about their details;
                        </p>
                    </li>
                    <li>
                        <p>
                            Demand the correction of incorrect or complete
                            personal data stored with us;
                        </p>
                    </li>
                    <li>
                        <p>
                            Demand the correction or deletion of your personal
                            data stored by us, unless the processing for the
                            exercise of the right to freedom of expression and
                            information, for the fulfillment of a legal
                            obligation, for reasons of public interest or for
                            the assertion, exercise or defense of Legal claims
                            is required;
                        </p>
                    </li>
                    <li>
                        <p>
                            Demand the restriction of the processing of your
                            personal data. Dispute the accuracy of the data that
                            the processing is unlawful, or whether we continue
                            need the data. You can exercise a defense of your
                            legal claims where you have objected to the data
                            processing in accordance with Art. 21 GDPR;
                        </p>
                    </li>
                    <li>
                        <p>
                            Receive your personal data provided to us in a
                            structured, standard, and machine-readable format or
                            to request transmission to another person
                            responsible;
                        </p>
                    </li>
                    <li>
                        <p>
                            Revoke your once given consent to us at any time. As
                            a result, we are not allowed to continue the data
                            processing based on this consent cancellation.
                        </p>
                    </li>
                    <li>
                        <p>
                            Contact the supervisory authority of your usual
                            place of residence.
                        </p>
                    </li>
                </ul>
                <h3>
                    <strong>10. Withdrawal and Rights</strong>
                </h3>
                <h6>
                    You have the right to object to the processing of your
                    personal data provided that there are reasons for this
                    arising from your particular situation or the objection is
                    directed against direct mail. In the latter case, you have a
                    general right of objection, which is implemented by us
                    without specifying any particular situation.
                </h6>
                <h6>
                    You also have the right to revoke a consent once given to us
                    at any time. As a result, we will not continue the data
                    processing based on this consent for the future. By the
                    revocation of the consent, the legality the processing on
                    the basis of the consent until the revocation is not
                    affected.
                </h6>
                <h6>
                    If you would like to exercise your right to revocation or
                    objection, please send an email to{' '}
                    <a href="mailto:contact@reflexer.finance.">
                        contact@reflexer.finance.
                    </a>
                </h6>
                <h3>
                    <strong>
                        11. Double Opt In and Registration Data in the European
                        Union
                    </strong>
                </h3>
                <p>
                    In accordance with GDPR, we use the so-called Double Opt-in
                    method. We will only send you e-mail if you confirm by
                    clicking on a link in our notification e-mail that you are
                    the owner of the given e-mail address. If you confirm your
                    e-mail address, we will save your e-mail address and the
                    time of registration until you unsubscribe. You can
                    unsubscribe from e-mail at any time, except that we may
                    still send you an email if you request a password reset. A
                    corresponding unsubscribe link can be found in every e-mail.
                    A message to the above or in the specified contact
                    information (e.g. by e-mail or letter) is also sufficient.
                    The legal basis of this processing is your consent in
                    accordance with Art. 6 para. 1 lit of the GDPR.
                </p>
                <p>
                    In our email, we use commercially available technologies
                    that measure the interactions with the e-mail (e.g., opening
                    the e-mail, clicked links). We use this data in pseudonymous
                    form for general statistical evaluations as well as for the
                    optimization and further development of our content and
                    customer communication. This is done with the help of small
                    graphics that are embedded in the e-mail (so-called pixels).
                    The data is collected exclusively pseudonymized and also not
                    linked with your other personal information. Legal basis for
                    this is our aforementioned legitimate interest. Through our
                    e-mail, we want to share content relevant to our customers
                    and better understand what readers are actually interested
                    in. If you do not want us to include your information in our
                    analysis of usage behavior, you can unsubscribe from e-mails
                    or deactivate graphics in your e-mail program by default.
                    The data for the interaction with our e-mails may be stored
                    pseudonymously for 30 days and then completely anonymized.
                </p>
                <h3>
                    <strong>12. Storage time</strong>
                </h3>
                <p>
                    As a matter of principle, we store personal data only as
                    long as necessary to fulfill the contractual or legal
                    obligations to which we have collected the data. Thereafter,
                    we delete the data immediately, unless we need the data
                    until the expiration of the statutory limitation period for
                    evidence for civil claims or for statutory storage
                    requirements.
                </p>
                <p>
                    Even after that, we sometimes have to save your data for
                    accounting reasons. We are obliged to do so because of legal
                    documentation obligations which may arise from legal
                    obligations. The deadlines for storing documents are two to
                    ten years, although currently we store data for five (5)
                    years.
                </p>
                <h3>
                    <strong>13. Data security</strong>
                </h3>
                <p>
                    If you have created an account, access to this account is
                    only possible after entering your personal password. You
                    should always keep your access information confidential and
                    close the browser window when you stop communicating with
                    us, especially if you share your computer with others. In
                    addition, we use SSL (Secure Socket Layer) technology in
                    connection with the highest encryption level supported by
                    your browser. In general, this is a 256-bit encryption.
                    Firebase services encrypt data in transit using HTTPS, and
                    also encrypted in the database. Firebase logically isolates
                    customer data. In addition, we take appropriate technical
                    and organizational security measures to protect your data
                    against accidental or intentional manipulation, partial or
                    total loss, destruction or against unauthorized access by
                    third parties. Our security measures are continuously
                    improved in line with technological developments.
                </p>
                <p>
                    Although we take precautions intended to help protect the
                    personal information that we collect and process, no system
                    or electronic data transmission is completely secure. Any
                    transmission of your personal information is at your own
                    risk and we expect that you will use appropriate security
                    measures to protect your personal information.
                </p>
                <p>
                    We may suspend your use of all or part of the Services
                    without notice if we suspect or detect any breach of
                    security. You understand and agree that we may deliver
                    electronic notifications about breaches of security to the
                    email address that you provided to us.
                </p>
                <p>
                    If you create an account, you are responsible for
                    maintaining the security of and the information in your
                    account, including your password.
                </p>
                <h3>
                    <strong>14. CHILDREN&rsquo;S INFORMATION</strong>
                </h3>
                <p>
                    The Services we provide are intended solely for adults and
                    for adult use. We do not knowingly collect any information
                    from children under the age of 13. If a parent or legal
                    guardian becomes aware that his or her child is using our
                    services, or has provided us with any personally
                    identifiable information, he or she should contact us at
                    contact@reflexer.finance. If we become aware that a child
                    under 13 has provided us with any personally identifiable
                    information, we will promptly delete such information along
                    with the child&rsquo;s account.
                </p>
                <p>
                    To contact us, you may use the following contact
                    information:
                </p>
                <p>Reflexer Labs, Inc.</p>
                <p>Address: 4023 Kennett Pike #50387, Wilmington, DE 19807</p>
                <p>Tel.: +1 302-219-0308</p>
                <p>
                    Email:{' '}
                    <a href="mailto:contact@reflexer.finance">
                        contact@reflexer.finance
                    </a>
                </p>
                <h3>
                    <strong>15. CCPA</strong>
                </h3>
                <p>
                    The California Consumer Privacy Act (CCPA) places
                    obligations on organizations that collect personal
                    information of California consumers.
                </p>
                <h5>Your California Privacy Rights</h5>
                <p>
                    This section provides additional details about the personal
                    information we collect about California consumers and the
                    rights afforded to them under the California Consumer
                    Privacy Act or &ldquo;CCPA.&rdquo;
                </p>
                <p>
                    For more details about the personal information we have
                    collected over the last 12 months, including the categories
                    of sources, please see Section 2 above, titled{' '}
                    <strong>
                        &ldquo;General collection, processing and use of
                        personal data in the context of the use of the
                        App,&rdquo;
                    </strong>{' '}
                    along with relevant other sections. We collect this
                    information for the business and commercial purposes
                    described above. We share this information with the
                    categories of third parties described above (as such term is
                    defined in the CCPA) the personal information we collect.{' '}
                    <strong>
                        We do not sell your personal information; and will not
                        sell your personal information without providing you the
                        ability to opt out
                    </strong>
                    . Please note that we may use third-party cookies for our
                    advertising purposes as further described above.
                </p>
                <p>
                    Subject to certain limitations, the CCPA provides California
                    consumers the right to request to know more details about
                    the categories or specific pieces of personal information we
                    collect (including how we use and disclose this
                    information), to delete their personal information, to opt
                    out of any &ldquo;sales&rdquo; of their personal information
                    that may be occurring, and to not be discriminated against
                    for exercising these rights.
                </p>
                <p>
                    We will verify your request using the information associated
                    with your account, including email address. Government
                    identification may be required. Consumers can also designate
                    an authorized agent to exercise these rights on their
                    behalf.&nbsp;
                </p>
                <p>Please note:</p>
                <ul>
                    <li>
                        <p>
                            We may not honor part or all of a request you make
                            to exercise your rights under CCPA &ndash; for
                            example, certain information we collect is exempt
                            from this California Privacy Notice, such as
                            publicly-available information collected from a
                            government agency. When this occurs and we do not
                            honor your request, we will explain why in our
                            response.
                        </p>
                    </li>
                </ul>
                <p>
                    California consumers may make a request pursuant to their
                    rights under the CCPA by contacting us at
                </p>
                <p>Reflexer Labs, Inc.</p>
                <p>Address: 4023 Kennett Pike #50387, Wilmington, DE 19807</p>
                <p>Tel.: +1 302-219-0308</p>
                <p>
                    Email:{' '}
                    <a href="mailto:contact@reflexer.finance">
                        contact@reflexer.finance
                    </a>
                </p>
                <p>
                    We will verify your request using the information associated
                    with your account, including email address. Government
                    identification may be required. Consumers can also designate
                    an authorized agent to exercise these rights on their
                    behalf.
                </p>
                <p>California consumers have the following rights:</p>
                <ul>
                    <li>
                        <p>
                            You have the right to request information about the
                            categories and specific pieces of personal
                            information we have collected about you, as well as
                            the categories of sources used to collect the
                            information, the purpose for collecting such
                            information, and the categories of third parties
                            with whom we share such information.
                        </p>
                    </li>
                    <li>
                        <p>
                            <strong>
                                We do not sell your personal information, and
                                will not sell your personal information without
                                providing you the ability to opt out
                            </strong>
                        </p>
                    </li>
                    <li>
                        <p>
                            You have the right to request information about our
                            disclosure for business purposes of your Personal
                            Information to third parties.
                        </p>
                    </li>
                    <li>
                        <p>
                            You have the right to request the deletion of your
                            Personal Information.
                        </p>
                    </li>
                    <li>
                        <p>
                            You have the right to not be discriminated against
                            for exercising any of these rights.
                        </p>
                    </li>
                </ul>
                <h5>
                    <strong>
                        <em>Change Requests</em>
                    </strong>
                </h5>
                <p>
                    California consumers may make a request pursuant to their
                    rights under the CCPA by contacting us at the email address
                    or telephone number located in this privacy policy.
                </p>
                <h3>
                    <strong>16. CHANGES, DOWNLOADING, AND PRINTING</strong>
                </h3>
                <p>
                    This Privacy Policy is effective as of the date on which it
                    is made available on the site and is effective as of August
                    2020. As our site evolves and offers become available, or as
                    a result of changes in government or regulatory
                    requirements, it may be necessary to change this privacy
                    policy. The current version of the privacy policy is the
                    version that is currently applicable, and can be retrieved
                    and printed by you at any time on the URL you are currently
                    viewing.
                </p>
            </InnterContent>
        </GridContainer>
    )
}

export default Privacy

const Title = styled.h1`
    font-weight: 600;
    text-align: center;
    max-width: 450px;
    margin: 0 auto 60px auto;
    font-size: 50px;
    color: ${(props) => props.theme.colors.primary};
    ${({ theme }) => theme.mediaWidth.upToSmall`
   font-size:35px;
   `}
`

const InnterContent = styled.div`
    max-width: 1024px;
    margin: 0 auto 80px auto;
    padding-top: 100px;
    padding-right: 20px;
    padding-left: 20px;

    p {
        line-height: 1.8 !important;
        margin-bottom: 0 !important;
        > strong {
            font-size: calc(0.51vw + 0.51vh + 0.5vmin);
            line-height: 2;
            font-weight: 600;
            margin: 0;
            color: ${(props) => props.theme.colors.primary};
            a {
                ${ExternalLinkArrow}
                display:inline;
                font-size: calc(0.44vw + 0.44vh + 0.5vmin);
                word-break: break-all;
            }
            ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 16px;
      a{
        font-size: 16px;
      }
    `}
        }
    }
    p,
    li {
        color: ${(props) => props.theme.colors.secondary};
        font-weight: 600;
        font-size: calc(0.46vw + 0.46vh + 0.5vmin);
        ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size:15px;
  `}
        a {
            ${ExternalLinkArrow}
            display:inline;
            font-size: calc(0.44vw + 0.44vh + 0.5vmin);
            word-break: break-all;
            ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 15px;
     
    `}
        }
    }

    h3 {
        font-size: calc(0.8vw + 0.8vh + 0.5vmin);
        font-weight: 600;
        color: ${(props) => props.theme.colors.primary};
        margin-top: 60px;
        margin-bottom: 20px;
        ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size:20px;
  margin-bottom:20px;
  `}
    }

    h5 {
        font-size: calc(0.6vw + 0.6vh + 0.5vmin);
        line-height: 2;
        margin: 20px 0 0 0;
        color: ${(props) => props.theme.colors.primary};
        font-weight: 600;
        a {
            ${ExternalLinkArrow}
            display:inline;
            font-size: calc(0.44vw + 0.44vh + 0.5vmin);
            word-break: break-all;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 17px;
      a{
        font-size: 17px;
      }
    `}
    }

    h6 {
        font-size: calc(0.53vw + 0.53vh + 0.5vmin);
        line-height: 2;
        margin: 0;

        a {
            ${ExternalLinkArrow}
            display:inline;
            font-size: calc(0.48vw + 0.48vh + 0.5vmin);
            word-break: break-all;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 16px;
      a{
        font-size: 16px;
      }
    `}
    }
`

const Date = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    text-align: center;
    margin: 30px 0 80px 0;
    font-weight: bold;
`
