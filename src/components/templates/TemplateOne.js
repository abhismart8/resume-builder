export default function TemplateOne({ data }) {
    const {
        personal = {},
        summary = "",
        skills = [],
        experience = [],
        education = [],
        projects = [],
        certifications = [],
        awards = [],
        languages = [],
        volunteer = [],
        references = [],
        interests = [],
        publications = [],
        memberships = [],
        links = {},
        customSections = [],
    } = data || {};

    return (
        <div
  id="resume"
  className="bg-white text-gray-900 w-[210mm] min-h-[297mm] p-10 border border-gray-300"
>

            <h1 className="text-4xl font-bold tracking-tight">
                {personal.name || "Your Name"}
            </h1>

            <p className="text-sm text-gray-600">
                {personal.email}
                {personal.phone && ` | ${personal.phone}`}
                {personal.location && ` | ${personal.location}`}
            </p>

            <hr className="my-4" />

            <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
                {summary || "Your professional summary"}
            </p>

            {skills.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Skills</h2>
                    <ul>
                        {skills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                        ))}
                    </ul>
                </>
            )}

            {experience.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Experience</h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <strong>{exp.role}</strong> – {exp.company}
                            <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</div>
                            <div className="text-sm">{exp.description}</div>
                        </div>
                    ))}
                </>
            )}

            {education.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Education</h2>
                    {education.map((edu, i) => (
                        <div key={i}>
                            {edu.degree} – {edu.institution} ({edu.year})
                        </div>
                    ))}
                </>
            )}

            {projects.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Projects</h2>
                    {projects.map((project, i) => (
                        <div key={i} className="mb-3">
                            <strong>{project.name}</strong>
                            {project.technologies && <div className="text-xs text-gray-600">{project.technologies}</div>}
                            <div className="text-sm">{project.description}</div>
                            {project.link && <div className="text-xs text-blue-600">{project.link}</div>}
                        </div>
                    ))}
                </>
            )}

            {certifications.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Certifications</h2>
                    {certifications.map((cert, i) => (
                        <div key={i}>
                            {cert.name} – {cert.issuer} ({cert.date})
                            {cert.credentialId && <div className="text-xs text-gray-600">ID: {cert.credentialId}</div>}
                        </div>
                    ))}
                </>
            )}

            {awards.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Awards & Honors</h2>
                    {awards.map((award, i) => (
                        <div key={i} className="mb-2">
                            <strong>{award.name}</strong> – {award.issuer} ({award.date})
                            {award.description && <div className="text-sm">{award.description}</div>}
                        </div>
                    ))}
                </>
            )}

            {languages.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Languages</h2>
                    <ul>
                        {languages.map((lang, i) => (
                            <li key={i}>{lang.name} ({lang.proficiency})</li>
                        ))}
                    </ul>
                </>
            )}

            {volunteer.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Volunteer Experience</h2>
                    {volunteer.map((vol, i) => (
                        <div key={i} className="mb-3">
                            <strong>{vol.role}</strong> – {vol.organization}
                            <div className="text-xs text-gray-600">{vol.startDate} - {vol.endDate}</div>
                            <div className="text-sm">{vol.description}</div>
                        </div>
                    ))}
                </>
            )}

            {publications.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Publications</h2>
                    {publications.map((pub, i) => (
                        <div key={i} className="mb-2">
                            <strong>"{pub.title}"</strong>
                            <div>{pub.journal} ({pub.date})</div>
                            {pub.link && <div className="text-xs text-blue-600">{pub.link}</div>}
                        </div>
                    ))}
                </>
            )}

            {memberships.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Professional Memberships</h2>
                    {memberships.map((mem, i) => (
                        <div key={i}>
                            {mem.role} – {mem.organization} ({mem.startDate} - {mem.endDate})
                        </div>
                    ))}
                </>
            )}

            {interests.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Interests</h2>
                    <p className="text-sm">{interests.join(", ")}</p>
                </>
            )}

            {(links.linkedin || links.github || links.portfolio || links.website) && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">Links</h2>
                    <div className="text-sm">
                        {links.linkedin && <div>LinkedIn: {links.linkedin}</div>}
                        {links.github && <div>GitHub: {links.github}</div>}
                        {links.portfolio && <div>Portfolio: {links.portfolio}</div>}
                        {links.website && <div>Website: {links.website}</div>}
                    </div>
                </>
            )}

            {references.length > 0 && (
                <>
                    <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">References</h2>
                    {references.map((ref, i) => (
                        <div key={i} className="mb-3">
                            <strong>{ref.name}</strong>
                            <div>{ref.position} at {ref.company}</div>
                            <div className="text-sm text-gray-600">
                                {ref.email} | {ref.phone}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {customSections.length > 0 && (
                customSections.map((section, i) => (
                    <div key={i}>
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 mt-6 mb-2">{section.title}</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}
